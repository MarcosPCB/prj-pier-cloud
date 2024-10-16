import { z } from "zod";
import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";
import makeSubscribeQueue from "./services/SubscribeQueue";

export default class Controller {
    async subscribeQueue(req: Request, res: Response) {
        try {
            const params = z.object({
                queue: z.string().optional()
            });

            const { queue } = params.parse(req.body);

            const service = makeSubscribeQueue();

            await service.execute(queue);
            res.status(200).send(`Success - exported CSV`);
        } catch(err: any) {
            const { status, message, data } = handleError(err);
            return res.status(status).json({ message, data });
        }
    }
}