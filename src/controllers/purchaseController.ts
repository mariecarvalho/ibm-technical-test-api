import { Response, Request } from 'express';
import { PURCHASE_URL } from '../config';
import { Purchase } from '../types';

const axios = require("axios");

class PurchaseController {
    
    getSortedPurchases = async (_req: Request, res: Response) => {
        const purchases = await this.getPurchases();
        res.send(purchases.sort((a: Purchase, b: Purchase) => a.preco - b.preco));
    }

    async getPurchases() {
        try {
            const response = await axios.get(PURCHASE_URL);

            if (response?.data?.length > 0) {
                return response.data;
            } else {
                throw new Error('No purchases found.');
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Error fetching purchases.';
        }
    }

    getBiggestPurchasesPerYear = async (req: Request, res: Response) => {
        try {
            const purchases = await this.getPurchases();
            const year = req.params.ano;

            const filteredPurchasesPerYear = purchases?.filter((purchase: Purchase) => {return purchase.ano_compra === parseInt(year)});

            if(filteredPurchasesPerYear?.length > 0){
                const maxPurchase = filteredPurchasesPerYear.reduce((max: Purchase, current: Purchase) => (current.preco > max.preco ? current : max));
                res.send(maxPurchase);
            } else {
                res.status(404).json({message: `No purchases found for ${year}.`});
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error fetching purchases per year.' });
        }
    }
    
}

export default new PurchaseController()