import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";
import { z } from "zod";
import makeDownloadCSV from "./services/DownloadCSV";
import logger from "m-node-logger";

export default class Controller {
    async downloadCSV(req: Request, res: Response) {
        try {
            const params = z.object({
                id: z.string()
            });

            const { id } = params.parse(req.query);

            const service = makeDownloadCSV();

            const result = await service.execute(Number(id));
            res.setHeader(`Content-Type`, 'text/csv');
            return res.download(result, (err) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({
                        message: `Unable to download file ${result}`,
                        data: err
                    });
                }
            });
        } catch(err: any) {
            const { status, message, data } = handleError(err);
            return res.status(status).json({ message, data });
        }
    }
}