import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";
import { z } from "zod";
import makeDownloadCSV from "./services/DownloadCSV";
import logger from "m-node-logger";

export default class Controller {
    async downloadCSV(req: Request, res: Response) {
        /* 	#swagger.tags = ['seller']
            #swagger.description = 'Endpoint para fazer download dos CSVs de um determinado vendedor' */

        /*	#swagger.parameters['id'] = {
            in: 'query',
            description: 'ID do vendedor',
            required: true,
        } */

        /* #swagger.responses[200] = { 
            description: "Faz download do arquivo CSV ou do seu backup" 
        } */

        /* #swagger.responses[404] = { 
            description: "Não foi possível encontrar o CSV requisitado" 
        } */

        /* #swagger.responses[500] = { 
            description: "Erro no servidor ou não possível fazer download do arquivo" 
        } */

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