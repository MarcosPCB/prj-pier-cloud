import { z } from "zod";
import makeGenerateMessages from "./services/GenerateMessages";
import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";
import makeSendSingleMessage from "./services/SendSingleMessage";

export default class Controller {
    async generateMessages(req: Request, res: Response) {
        try {
            const params = z.object({
                queue: z.string().optional()
            });

            const { queue } = params.parse(req.body);

            const service = makeGenerateMessages();

            const sent = await service.execute(queue);
            res.status(200).send(`Sent ${sent} sellers to broker`);
        } catch(err: any) {
            const { status, message, data } = handleError(err);
            return res.status(status).json({ message, data });
        }
    }

    async sendSingleMessage(req: Request, res: Response) {
        try {
            const params = z.object({
                seller: z.object({
                    nome: z.string(),
                    telefone: z.string(),
                    id: z.number()
                }),
                queue: z.string().optional()
            });

            const { seller, queue } = params.parse(req.body);

            const service = makeSendSingleMessage();

            const sent = await service.execute(seller, queue);
            res.status(200).send(`success`);
        } catch(err: any) {
            const { status, message, data } = handleError(err);
            return res.status(status).json({ message, data });
        }
    }
}