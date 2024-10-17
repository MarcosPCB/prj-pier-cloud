import axios, { Axios, AxiosResponse } from "axios";
import { TClient, TProduct, IReport, TSales, TSeller } from "../types";
import { env } from "../../../shared/env";
import AppError from "../../../shared/errors/AppError";
import logger from "m-node-logger";

class Consolidate {
    constructor(
        private readonly salesAPI: Axios,
        private readonly clientAPI: Axios,
        private readonly productAPI: Axios,
     ) {}

    async execute(seller: TSeller) {
        let sales: TSales[] = [],
            clients: TClient[] = [],
            products: TProduct[] = [];

        await Promise.all([
            this.salesAPI.get('/').then((e) => {
                const json = JSON.parse(e.data);
                sales = json;
            }),
            this.clientAPI.get('/').then((e) => {
                const json = JSON.parse(e.data);
                clients = json;
            }),
            this.productAPI.get('/').then((e) => {
                const json = JSON.parse(e.data);
                products = json;
            })
        ]);

        if(sales.length == 0
            || clients.length == 0
            || products.length == 0)
            throw new AppError(`Invalid data from one of the APIs`, 500);

        const salesBySeller: TSales[] = sales.filter(e => e.vendedor_id == seller.id);

        if(salesBySeller.length == 0)
            throw new AppError(`Reported sale by seller ${seller.id} is missing from sales API`, 500);

        logger.info(`${salesBySeller.length} sales by ${seller.id}`);

        const report: IReport[] = await Promise.all(salesBySeller.map((e) => {
            const product = products.find(p => p.id == e.produto_id);
            if(!product)
                throw new AppError(`Missing product info: ${e.produto_id}`, 500);

            const client = clients.find(c => c.id == e.cliente_id);
            if(!client)
                throw new AppError(`Missing client info: ${e.produto_id}`, 500);

            return <IReport> {
                "ID do Vendedor": seller.id,
                "Nome do Vendedor": seller.nome,
                "Telefone do Vendedor": seller.telefone,
                "ID do Cliente": e.cliente_id,
                "Nome do Cliente": client.nome,
                "Telefone do Cliente": client.telefone,
                "Email do Cliente": client.email,
                "ID do Produto": e.produto_id,
                "Nome do Produto": product.nome,
                "Preço do Produto": product.preco,
                "SKU do Produto": product.sku
            }
        }));

        logger.info(`Report for seller ${seller.id} created`);

        return report;
    }
}

export default function makeConsolidate() {
    return new Consolidate(
        new Axios({baseURL: env.API_SALES_URL}),
        new Axios({baseURL: env.API_CLIENT_URL}),
        new Axios({baseURL: env.API_PRODUCT_URL}),
    );
}