import { z } from "zod";
import makeGenerateMessages from "./services/GenerateMessages";
import { Request, Response } from "express";
import handleError from "../../shared/errors/handleError";
import makeSendSingleMessage from "./services/SendSingleMessage";

export default class Controller {
    async generateMessages(req: Request, res: Response) {
        /* 	#swagger.tags = ['messager']
            #swagger.description = 'Endpoint gerar as mensagens e envia-las ao Broker através da API de vendedores' */

        /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Dado para envio das mensagens',
            required: false,
            schema: { queue: "Nome da fila no Broker" }
        } */

        /* #swagger.responses[200] = { 
            schema: "Sent X sellers to broker",
            description: "Enviado X mensagens para o Broker" 
        } */

        /* #swagger.responses[500] = { 
            description: "Erro no servidor ou não foi possível se conectar ao Broker" 
        } */

        /* #swagger.responses[502] = { 
            description: "Resposta inválida da API de vendedores" 
        } */
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
        /* 	#swagger.tags = ['messager']
            #swagger.description = 'Endpoint gerar uma única mensagem e envia-la ao Broker' */

        /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Dados da mensagem',
            required: true,
            schema: { $ref: '#/definitions/SingleMessage' }
        } */

        /* #swagger.responses[200] = { 
            schema: "success",
            description: "Mensagem enviada à fila do Broker" 
        } */

        /* #swagger.responses[400] = { 
            description: "Paramêtros da chamada faltando" 
        } */

        /* #swagger.responses[500] = { 
            description: "Erro no servidor ou não foi possível se conectar ao Broker" 
        } */
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