import { connect, ConsumeMessage } from "amqplib";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import { SellerType } from "../types";
import logger from "m-node-logger";


class SubscribeQueue {
    async execute() {
        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        const channel = await broker.createChannel();

        await channel.assertQueue(env.BROKER_QUEUE, {
            durable: true
        });

        await channel.consume(env.BROKER_QUEUE, (msg: ConsumeMessage | null) => {
            if(msg) {
                let data: SellerType;
                try {
                    data = JSON.parse(String(msg.content));
                } catch (err) {
                    logger.error(`Tried to consume something that is not a JSON`);
                    return;
                }

                logger.info(`Received message from seller: ${data.id}`);

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