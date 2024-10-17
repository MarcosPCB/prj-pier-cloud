export type TSeller = {
    nome: string,
    telefone: string,
    id: number
}

export type TClient = 
    TSeller & { email: string }

export type TSales = {
    vendedor_id: number,
    produto_id: number,
    cliente_id: number,
    id: number
}

export type TProduct = {
    nome: string,
    tipo: string,
    preco: number,
    sku: number,
    vendedor_id: number,
    id: number,
}

export interface IReport {
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