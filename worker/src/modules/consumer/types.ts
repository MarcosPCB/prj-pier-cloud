export type SellerType = {
    nome: string,
    telefone: string,
    id: number
}

export type ClientType = 
    SellerType & { email: string }

export type SalesType = {
    vendedor_id: number,
    produto_id: number,
    cliente_id: number,
    id: number
}

export type ProductType = {
    nome: string,
    tipo: string,
    preco: number,
    sku: number,
    vendedor_id: number,
    id: number,
}

export interface ReportInterface {
    'ID do Vendedor': number,
    'Nome do Vendedor': string,
    'Telefone do Vendedor': string,
    'ID do Cliente': number,
    'Nome do Cliente': string,
    'Telefone do Cliente': string,
    'Email do Cliente': string,
    'ID do Produto': number,
    'Nome do Produto': string,
    'Preço do Produto': number,
    'SKU do Produto': number
}