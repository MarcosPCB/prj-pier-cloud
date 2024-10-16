import { connect, ConsumeMessage } from "amqplib";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import { SellerType } from "../types";
import logger from "m-node-logger";
import makeConsolidate from "./Consolidate";
import makeExportCSV from "./ExportCSV";
import handleError from "../../../shared/errors/handleError";

class SubscribeQueue {
    async execute(queue?: string) {
        if(!queue)
            queue = env.BROKER_QUEUE;

        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        const channel = await broker.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        await channel.consume(queue, async (msg: ConsumeMessage | null) => {
            if(msg) {
                let data: SellerType;
                try {
                    data = JSON.parse(String(msg.content));
                } catch (err) {
                    logger.warn(`Tried to consume something that is not a JSON`);
                    return;
                }

                logger.info(`Received message from seller: ${data.id}`);

                const service = makeConsolidate();
                service.execute(data).then((report) => {
                    const service = makeExportCSV();
                    service.execute(report, data.id).catch((err: any) => {
                        const { status, message, data } = handleError(err);
                        logger.error(`Status: ${status} - ${message} - ${data}`);
                    });
                }).catch((err: Error) => {
                    const { status, message, data } = handleError(err);
                    logger.error(`Status: ${status} - ${message} - ${data}`);
                });
            }
        }, {
            noAck: true
        });

        return true;
    }
}

export default function makeSubscribeQueue() {
    return new SubscribeQueue();
}