import { connect, Connection } from "amqplib";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import logger from "m-node-logger";
import { SellerType } from "../types";

class SendSingleMessage {
    async execute(sellerData: SellerType, queue?: string) {
        if(!queue)
            queue = env.BROKER_QUEUE;

        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        const channel = await broker.createChannel();

        channel.assertQueue(queue, {
            durable: true
        });

        const message = JSON.stringify(sellerData);

        channel.sendToQueue(env.BROKER_QUEUE, Buffer.from(message), {
            persistent: true
        });

        logger.info(`Message ${message}`);

        broker.close;

        return true;
    }
}

export default function makeSendSingleMessage() {
    return new SendSingleMessage()
}