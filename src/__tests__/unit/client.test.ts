import axios from 'axios';
import ClientController from '../../controllers/clientController';
import PurchaseController from '../../controllers/purchaseController';
import { Purchase, Client } from '../../types';

jest.mock('axios');

describe("Client Controller", () => {
    let clientController: any;
    let purchaseController: any;

    beforeEach(() => {
        clientController = ClientController;
        purchaseController = PurchaseController;
    });

    const mockClients: Client[] = [
        {
            "nome": "Mariane Carvalho",
            "cpf": "890.234.241-01",
            "telefone": "(01) 8902-3456",
            "compras_vinho": [
                { "tipo": "Branco", "quantidade": 7, },
                { "tipo": "Rosé", "quantidade": 1 }
            ]
        },
        {
            "nome": "José Lima",
            "cpf": "321.414.901-35",
            "telefone": "(31) 2346-7890",
            "compras_vinho": [
                { "tipo": "Tinto", "quantidade": 4 },
                { "tipo": "Branco", "quantidade": 3 }
            ]
        },
        {
            "nome": "Gabriel Faria",
            "cpf": "678.111.231-90",
            "telefone": "(51) 6781-2345",
            "compras_vinho": [
                { "tipo": "Tinto", "quantidade": 5 },
                { "tipo": "Branco", "quantidade": 4 }
            ]
        },
        {
            "nome": "Fernando Fernandes",
            "cpf": "343.555.312-34",
            "telefone": "(61) 3457-8901",
            "compras_vinho": [
                { "tipo": "Branco", "quantidade": 6 },
                { "tipo": "Rosé", "quantidade": 2 }
            ]
        },
    ];

    const mockResponse = {
        data: mockClients,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    };

    const mockPurchaseList: Purchase[] = [
        { tipo_vinho: 'Tinto', preco: 60.2, safra: "2020", ano_compra: 2010 },
        { tipo_vinho: 'Rosé', preco: 70.8, safra: "2020", ano_compra: 2010 },
        { tipo_vinho: 'Branco', preco: 54.0, safra: "2009", ano_compra: 2020 },
    ];

    const mockClientsWithTotal: Client[] = [
        {
            "nome": "Mariane Carvalho",
            "cpf": "890.234.241-01",
            "telefone": "(01) 8902-3456",
            "compras_vinho": [
                { "tipo": "Branco", "quantidade": 7, "total": 378 },
                { "tipo": "Rosé", "quantidade": 1, "total": 70.8 }
            ]
        },
        {
            "nome": "José Lima",
            "cpf": "321.414.901-35",
            "telefone": "(31) 2346-7890",
            "compras_vinho": [
                { "tipo": "Tinto", "quantidade": 4, "total": 240.8 },
                { "tipo": "Branco", "quantidade": 3, "total": 162.0 }
            ]
        },
        {
            "nome": "Gabriel Faria",
            "cpf": "678.111.231-90",
            "telefone": "(51) 6781-2345",
            "compras_vinho": [
                { "tipo": "Tinto", "quantidade": 5, "total": 301.0 },
                { "tipo": "Branco", "quantidade": 4, "total": 216.0 }
            ]
        },
        {
            "nome": "Fernando Fernandes",
            "cpf": "343.555.312-34",
            "telefone": "(61) 3457-8901",
            "compras_vinho": [
                { "tipo": "Branco", "quantidade": 6, "total": 324 },
                { "tipo": "Rosé", "quantidade": 2, "total": 141.6 }
            ]
        },
    ];

    it("Should get clients", async () => {
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await clientController.getClients();

        expect(axios.get).toHaveBeenCalled;
        expect(result).toEqual(mockClients);
        expect(result).toHaveLength(4);
    });

    it("Should get add total cost to clients wine purchases", async () => {
        const result = await clientController.sumTotalCost(mockClients, mockPurchaseList);

        expect(result).toEqual(mockClientsWithTotal);
        expect(result).toHaveLength(4);
        for(const element of result){
            for (const item of element.compras_vinho){
                expect(item.total).toBeDefined();
                expect(item.total).not.toBeNull();
                expect(item.total).not.toBeNaN();
            }
        }
    });

    it("Should sort and return the top 3 best buyers", async () => {
        const result = await clientController.sortBest3Clients(mockClientsWithTotal);

        expect(result).not.toEqual(mockClientsWithTotal);
        expect(result).toHaveLength(3);
    });

    it("Should get client by CPF", async () => {
        jest.spyOn(clientController, 'getClients').mockResolvedValue(mockClients);

        const result = await clientController.getClientByCPF('890.234.241-01');
        expect(result.cpf).toEqual('890.234.241-01');
        expect(result).toEqual(mockClients[0]);
    });

    it("Should get wine by type", async () => {
        jest.spyOn(purchaseController, 'getPurchases').mockResolvedValue(mockPurchaseList);

        const firstResponse = await clientController.getWinesByType('Tinto');
        expect(firstResponse[0].tipo_vinho).toEqual('Tinto');

        const secondeResponse = await clientController.getWinesByType('Rosé');
        expect(secondeResponse[0].tipo_vinho).toEqual('Rosé');

        const thirdResponse = await clientController.getWinesByType('Seco');
        expect(thirdResponse).toEqual([]);
    });

});