export type Purchase = {
    tipo_vinho: string;
    preco: number;
    safra: string;
    ano_compra: number;
};

export type Client = {
    nome: string;
    cpf: string;
    telefone: string;
    compras_vinho: WinePurchases[];
};

export type WinePurchases = {
    tipo: string,
    quantidade: number,
    total?: number
}