import { connect, Connection } from "amqplib";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import axios from "axios";
import logger from "m-node-logger";
import { SellerType } from "../types";

class GenerateMessages {
    async execute() {
        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        const response = await axios.get(env.API_SELLER_URL, {
            headers: {
                Accept: 'application/json'
            }
        });

        if(response.status != 200)
            throw new AppError(`Unable to get a valid response from seller's API`, 502);

        const channel = await broker.createChannel();

        const sellers: SellerType[] = response.data;

        let num_messages = 0;

        await Promise.race(sellers.map(async (seller) => {
            channel.assertQueue(env.BROKER_QUEUE, {
                durable: true
            });

            const message = JSON.stringify(seller);

            channel.sendToQueue(env.BROKER_QUEUE, Buffer.from(message));

            logger.info(`Message ${message}`);
            num_messages++;
        }));

        broker.close;

        return num_messages;
    }
}

export default function makeGenerateMessages() {
    return new GenerateMessages()
}