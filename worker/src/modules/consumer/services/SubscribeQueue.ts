import { connect, ConsumeMessage } from "amqplib";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import { TSeller } from "../types";
import logger from "m-node-logger";
import makeConsolidate from "./Consolidate";
import makeExportCSV from "./ExportCSV";
import handleError from "../../../shared/errors/handleError";
import { consumerStatus } from "../status";

class SubscribeQueue {
    async execute(queue?: string, tag?: string) {
        if(!queue)
            queue = env.BROKER_QUEUE;

        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        const channel = await broker.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        const consumer = await channel.consume(queue, async (msg: ConsumeMessage | null) => {
            consumerStatus.delivered++;
            if(msg) {
                let data: TSeller;
                try {
                    data = JSON.parse(String(msg.content));
                } catch (err) {
                    consumerStatus.delivered--;
                    logger.warn(`Tried to consume something that is not a JSON`);
                    return;
                }

                logger.info(`Received message from seller: ${data.id}`);

                const service = makeConsolidate();
                service.execute(data).then((report) => {
                    const service = makeExportCSV();
                    service.execute(report, data.id).then((result) => {
                        if(result) {
                            channel.ack(msg, false);
                            consumerStatus.acked++;
                        }
                    }).catch((err: any) => {
                        consumerStatus.delivered--;
                        const { status, message, data } = handleError(err);
                        logger.error(`Status: ${status} - ${message} - ${data}`);
                    });
                }).catch((err: Error) => {
                    consumerStatus.delivered--;
                    const { status, message, data } = handleError(err);
                    logger.error(`Status: ${status} - ${message} - ${data}`);
                });
            }
        }, {
            noAck: false,
            consumerTag: tag
        });

        if(consumer) {
            consumerStatus.queues.push({
                queue: queue,
                tag: consumer.consumerTag,
                channel
            });

            channel.on('error', () => {
                logger.warn(`Connection error. Restarting...`);
                const i = consumerStatus.queues.findIndex(e => e.queue == queue && e.tag == consumer.consumerTag);

                if(i == -1)
                    logger.error(`Something very worng has happened... Could not find the connected queue ${queue} by ${consumer.consumerTag}`);
                else
                    consumerStatus.queues.splice(i, 1);
                
                makeSubscribeQueue().execute(queue, tag);
            });

            channel.on('close', () => {
                logger.info(`Connection closed.`);
                const i = consumerStatus.queues.findIndex(e => e.queue == queue && e.tag == consumer.consumerTag);

                if(i == -1)
                    logger.error(`Something very worng has happened... Could not find the connected queue ${queue} by ${consumer.consumerTag}`);
                else
                    consumerStatus.queues.splice(i, 1);
            });
        }

        return consumer;
    }
}

export default function makeSubscribeQueue() {
    return new SubscribeQueue();
}