import Controller from '../src/modules/seller/Controller'
import { Request, response, Response } from 'express';
import logger from 'm-node-logger';
import fs, { unlinkSync } from  'fs';
import makeDownloadCSV from '../src/modules/seller/services/DownloadCSV';
import AppError from '../src/shared/errors/AppError';

logger.init({
    path: 'logs',
    level_error: true,
    level_warning: true,
    daily: true
});

describe('Seller Service', () => {
    let controller: Controller;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

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

    it(`Should return the CSV file path`, async () => {
        const path = await makeDownloadCSV().execute(1);

        expect(path).toBe(`CSVs/relatorio_1.csv`);
    });

    it(`Should return the backup CSV file path`, async () => {
        if(!fs.existsSync(`CSVs/relatorio_1.csv.bak`))
            fs.renameSync(`CSVs/relatorio_1.csv`, `CSVs/relatorio_1.csv.bak`);
        else
            fs.renameSync(`CSVs/relatorio_1.csv`, `CSVs/relatorio_1.csv.test`);

        const path = await makeDownloadCSV().execute(1);

        expect(path).toBe(`CSVs/relatorio_1.csv.bak`);

        if(fs.existsSync(`CSVs/relatorio_1.csv.test`))
            fs.renameSync(`CSVs/relatorio_1.csv.text`, `CSVs/relatorio_1.csv`);
        else
            fs.renameSync(`CSVs/relatorio_1.csv.bak`, `CSVs/relatorio_1.csv`);
    });

    it(`Should throw an error`, async () => {
        if(fs.existsSync(`CSVs/relatorio_1.csv`))
            fs.unlinkSync(`CSVs/relatorio_1.csv`);

        if(fs.existsSync(`CSVs/relatorio_1.csv.bak`))
            fs.unlinkSync(`CSVs/relatorio_1.csv.bak`);

        let error: AppError | null = null;

        try {
            await makeDownloadCSV().execute(1)
        } catch(err: any) {
            error = err;
        }

        expect(error).toBeInstanceOf(AppError);
    });
});