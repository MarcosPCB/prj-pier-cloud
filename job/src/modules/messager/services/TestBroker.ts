import { connect } from "amqplib";
import AppError from "../../../shared/errors/AppError";
import { env } from "../../../shared/env";
import logger from "m-node-logger";

class TestBroker {
    async execute() {
        const broker = await connect(env.API_BROKER_URL);

        if(!broker)
            throw new AppError(`Unable to connect to broker`, 500);

        logger.info(`Message broker connection: OK`);

        broker.close();

        return true;
    }
}

export default function makeTestBroker() {
    return new TestBroker();
}