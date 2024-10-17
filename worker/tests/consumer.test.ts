import axios from 'axios';
import { env } from '../src/shared/env';
import { IReport, TSeller } from '../src/modules/consumer/types'
import Controller from '../src/modules/consumer/Controller'
import { Request, Response } from 'express';
import { connect } from 'amqplib';
import logger from 'm-node-logger';
import fs from  'fs';
import papa from 'papaparse';
import makeConsolidate from '../src/modules/consumer/services/Consolidate';
import makeExportCSV from '../src/modules/consumer/services/ExportCSV';
import { consumerStatus } from '../src/modules/consumer/status';

logger.init({
    path: 'logs',
    level_error: true,
    level_warning: true,
    daily: true
});

describe('Consumer Service', () => {
    let controller: Controller;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    async function createQueue() {
        const response = await axios.get('https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendedores', {
            headers: {
                Accept: 'application/json'
            }
        });

        const connection = await connect(env.API_BROKER_URL);

        const channel = await connection.createChannel();

        const queue = await channel.assertQueue(env.BROKER_QUEUE, {
            durable: true
        });

        const data: TSeller[] = response.data;

        for(let i = 0; i < data.length; i++) {
            const e = data[i];
            await channel.sendToQueue(env.BROKER_QUEUE, Buffer.from(JSON.stringify(e)));
        }

        const check = await channel.checkQueue(env.BROKER_QUEUE);

        //if(check.messageCount != data.length)
            //throw `Unable to run test: invalid data sent to queue`;

        await connection.close();

        return data;
    }

    async function purgeQueue() {
        const connection = await connect(env.API_BROKER_URL);

        const channel = await connection.createChannel();

        const queue = await channel.assertQueue(env.BROKER_QUEUE, {
            durable: true
        });

        const purge = await channel.purgeQueue(env.BROKER_QUEUE);

        await connection.close();

        consumerStatus.acked = consumerStatus.delivered = 0;
    }

    beforeEach(() => {
        controller = new Controller();
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock, send: jsonMock }));
        res = { status: statusMock } as Partial<Response>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
      });

    it(`Should subscribe to the Broker's Queue`, async () => {
        const tag = 'TestTag';

        req.body = { queue: env.BROKER_QUEUE, tag };

        await controller.subscribeQueue(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ consumerTag: tag });

        const connection = await connect(env.API_BROKER_URL);

        const channel = await connection.createChannel();

        const queue = await channel.checkQueue(env.BROKER_QUEUE);

        expect(queue.consumerCount).toBe(1);

        await channel.cancel(tag);

        await connection.close();
    });

    it(`Should consolidate a seller's data into a CSV`, async () => {
        const testCSV = fs.readFileSync('tests/data/test_report_1.csv');
        const testData: IReport[] = papa.parse(testCSV.toString(), {
            quotes: true,
            delimiter: ",",	// auto-detect
            newline: "\r\n",	// auto-detect
            quoteChar: '"',
            escapeChar: '"',
            header: true,
            skipEmptyLines: false,
        } as papa.ParseConfig).data;

        const response = await axios.get('https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendedores', {
            headers: {
                Accept: 'application/json'
            }
        });

        console.log('Getting seller`s info...');

        const sellersData: TSeller[] = response.data;

        const sellerID_1 = sellersData.find(e => e.id == 1);

        if(!sellerID_1)
            throw `Unable to proceed with test: Seller's API returned invalid data`;

        const result = await makeConsolidate().execute(sellerID_1);

        expect(result).toStrictEqual(testData);

        const exported = await makeExportCSV().execute(result, sellerID_1.id);

        expect(exported).toBe(true);
        expect(fs.existsSync(`CSVs/relatorio_1.csv`)).toBe(true);
    }, 10000);

    it(`Should consume the queue and produce the CSVs`, async () => {
        await purgeQueue();

        //Clean all the files in the CSVs folder
        const files = fs.readdirSync('CSVs');
        for(let i = 0; i < files.length; i++)
            fs.unlinkSync(`CSVs/${files[i]}`);

        const messages: TSeller[] = await createQueue();

        let time = 0;

        const connection = await connect(env.API_BROKER_URL);

        const channel = await connection.createChannel();

        const tag = 'TestTag';

        req.body = { queue: env.BROKER_QUEUE, tag };

        await controller.subscribeQueue(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ consumerTag: tag });

        const sleep = (ms: any) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        while((consumerStatus.delivered < messages.length || consumerStatus.acked < messages.length) && time < 10000) {
            await sleep(100);
            time += 100;
        }

        expect(consumerStatus.delivered).toBe(messages.length);
        expect(consumerStatus.acked).toBe(messages.length);

        for(let i = 0; i < messages.length; i++) {
            const e = messages[i];
            expect(fs.existsSync(`CSVs/relatorio_${e.id}.csv`)).toBe(true);
        }

        await channel.cancel(tag);
        await connection.close();
    }, 12000);

    it(`Should restart the connection after an error`, async () => {
        await consumerStatus.closeQueues();

        req.body = { queue: env.BROKER_QUEUE };

        await controller.subscribeQueue(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);

        consumerStatus.queues[0].channel.emit('error');

        const sleep = (ms: any) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        await sleep(1000);

        expect(consumerStatus.queues.length).toBe(1);
        //@ts-ignore
        expect(consumerStatus.queues[0].tag).not.toBe(jsonMock.consumerTag);
    })
});