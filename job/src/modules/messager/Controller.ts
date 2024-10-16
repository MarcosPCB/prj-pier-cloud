import { z } from "zod";
import makeGenerateMessages from "./services/GenerateMessages";
import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";

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
}