import { connect, Connection } from "amqplib";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import axios, { Axios } from "axios";
import logger from "m-node-logger";
import { TSeller } from "../types";

class GenerateMessages {
    constructor(private readonly sellerApi: Axios) {}

    async execute(queue?: string) {
        if(!queue)
            queue = env.BROKER_QUEUE;

        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        const response = await this.sellerApi.get('/');

        if(response.status != 200)
            throw new AppError(`Unable to get a valid response from seller's API`, 502);

        const channel = await broker.createChannel();

        const sellers: TSeller[] = JSON.parse(response.data);

        let num_messages = 0;

        await Promise.race(sellers.map(async (seller) => {
            channel.assertQueue(queue, {
                durable: true
            });

            const message = JSON.stringify(seller);

            channel.sendToQueue(env.BROKER_QUEUE, Buffer.from(message), {
                persistent: true
            });

            logger.info(`Message ${message}`);
            num_messages++;
        }));

        broker.close;

        return num_messages;
    }
}

export default function makeGenerateMessages() {
    return new GenerateMessages(new Axios({
        baseURL: env.API_SELLER_URL
    }));
}