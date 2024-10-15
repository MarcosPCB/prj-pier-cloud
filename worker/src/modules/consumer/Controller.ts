import { z } from "zod";
import makeGenerateMessages from "./services/GenerateMessages";
import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";

export default class Controller {
    async generateMessages(req: Request, res: Response) {
        try {
            const service = makeGenerateMessages();

            const sent = await service.execute();
            res.status(200).send(`Sent ${sent} sellers to broker`);
        } catch(err: any) {
            const { status, message, data } = handleError(err);
            return res.status(status).json({ message, data });
        }
    }
}