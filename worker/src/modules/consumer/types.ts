export type SellerType = {
    nome: string,
    telefone: string,
    id: number
}

export type ClientType = {
    nome: string,
    telefone: string,
    email: string,
    id: number
}

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