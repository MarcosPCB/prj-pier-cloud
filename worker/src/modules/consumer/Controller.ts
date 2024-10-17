import { z } from "zod";
import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";
import makeSubscribeQueue from "./services/SubscribeQueue";

export default class Controller {
    async subscribeQueue(req: Request, res: Response) {
        /* 	#swagger.tags = ['consumer']
            #swagger.description = 'Endpoint para se inscrever em uma determinada fila do Broker de mensageria' */

        /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Dados do consumo da mensageria',
            required: false,
            schema: { queue: "Nome da fila no Broker", tag: "Nome da tag do consumidor" }
        } */

        /* #swagger.responses[200] = { 
            schema: { consumerTag: 'Tag do consumidor' },
            description: "Consumidor criado e está inscrito na fila do Broker" 
        } */

        /* #swagger.responses[500] = { 
            description: "Erro no servidor ou não foi possível se conectar ao Broker" 
        } */
        try {
            const params = z.object({
                queue: z.string().optional(),
                tag: z.string().optional()
            });

            const { queue, tag } = params.parse(req.body);

            const service = makeSubscribeQueue();

            const result = await service.execute(queue, tag);
            res.status(200).send(result);
        } catch(err: any) {
            const { status, message, data } = handleError(err);
            return res.status(status).json({ message, data });
        }
    }
}