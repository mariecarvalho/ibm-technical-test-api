import axios from 'axios';

import PurchaseController from '../../controllers/purchaseController';
import { Purchase } from '../../types';

jest.mock('axios');

describe("Purchase Controller", () => {
    let purchaseController: any;


    beforeEach(() => {
        purchaseController = PurchaseController;
    });

    it('Should get purchases', async () => {

        const mockPurchaseList: Purchase[] = [
            { tipo_vinho: 'Tinto', preco: 60.2, safra: "2020", ano_compra: 2010 },
            { tipo_vinho: 'Rosé', preco: 70.8, safra: "2020", ano_compra: 2010 },
            { tipo_vinho: 'Branco', preco: 54.0, safra: "2009", ano_compra: 2020 },
        ];

        (axios.get as jest.Mock).mockResolvedValue({ data: mockPurchaseList });        
        const result = await purchaseController.getPurchases();

        expect(result).toHaveLength(3);
        expect(result).toEqual(mockPurchaseList);
        expect(result[0].preco).toEqual(60.2);
        expect(result[1].preco).toEqual(70.8);
        expect(result[2].preco).toEqual(54.0);
    });
})