import axios from 'axios';
import { env } from '../src/shared/env';
import { SellerType } from '../src/modules/messager/types'
import Controller from '../src/modules/messager/Controller'
import { Request, Response } from 'express';
import { connect } from 'amqplib';
import logger from 'm-node-logger';

logger.init({
    path: 'logs',
    level_error: true,
    level_warning: true,
    daily: true
});

describe('Messager Service', () => {
    let controller: Controller;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    let sending = false;

    jest.mock('../src/modules/messager/services/GenerateMessages');

    beforeEach(() => {
        controller = new Controller();
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock, send: jsonMock }));
        res = { status: statusMock } as Partial<Response>;
    });

    afterEach(() => {
        jest.clearAllMocks();
      });

    it('Should send messages to a Broker Queue', async () => {
        const response = await axios.get(env.API_SELLER_URL, {
            headers: {
                Accept: 'application/json'
            }
        });

        if(response.status != 200) {
            console.error(`Unable to run test without Seller's API`);
            return false;
        }

        const sellers: SellerType[] = response.data;

        const num_msgs = sellers.length;

        req.body = { };

        await controller.generateMessages(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(`Sent ${num_msgs} sellers to broker`);

        const connection = await connect(env.API_BROKER_URL);

        const channel = await connection.createChannel();

        const queue = await channel.checkQueue(env.BROKER_QUEUE);

        expect(queue.messageCount).toBe(num_msgs);

        const purge = await channel.purgeQueue(env.BROKER_QUEUE);

        await connection.close();
    });
});