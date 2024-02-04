import { Response, Request } from 'express';
import { CLIENTS_URL } from '../config';
import { Purchase, Client, WinePurchases } from '../types';
import PurchaseController from '../controllers/purchaseController';

const axios = require("axios");

class ClientController {
    constructor(){}

    getTopClients = async (_req: Request, res: Response) => {
        try {
            const purchaseList = await PurchaseController.getPurchases();
            let clients = await this.getClients();

            this.sumTotalCost(clients, purchaseList);
            
            res.send(this.sortBest3Clients(clients));

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error fetching top 3 clients.' });
        }
    }

    async getClients(){
        try {
            const response = await axios.get(CLIENTS_URL);

            if (response?.data?.length > 0) {
                return response.data;
            } else {
                throw new Error('No clients found.');
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Error fetching clients.';
        }
    }

    sumTotalCost(clients: Client[], purchasesList: Purchase[]): Client[] {
        for(const client of clients){
            client.compras_vinho = client.compras_vinho.map((purchase: WinePurchases) => {
                const item = purchasesList.find((item: Purchase) => purchase.tipo === item.tipo_vinho);
                return { ...purchase, total: item?.preco ? item.preco * purchase.quantidade: 0 }
            })    
        }
        return clients;
    }

    sortBest3Clients(clients: Client[]): Client[] {
        const sortedClients = clients.sort((a: Client, b: Client) => {
            const aTotal = a.compras_vinho.reduce((sum: number, purchase: WinePurchases) => purchase.total ? sum + purchase.total: 0, 0);
            const bTotal = b.compras_vinho.reduce((sum: number, purchase: WinePurchases) => purchase.total ? sum + purchase.total: 0, 0);
            return (bTotal - aTotal);
        });
        return sortedClients.slice(0, 3);
    }

    getRecommendationByClient = async (req: Request, res: Response) => {
        try{
            const client = await this.getClientByCPF(req.params.cliente); 
            
            const favoriteType = client.compras_vinho.reduce((acc: WinePurchases, current: WinePurchases) => {
                return current.quantidade > acc.quantidade ? current : acc 
            }).tipo;
        
            const favoriteWines = await this.getWinesByType(favoriteType);
            res.send(favoriteWines[Math.floor(Math.random() * favoriteWines.length)]);
        } catch (error) {
            console.error('Error:', error);
            return 'Error fetching recommendation.';
        }
    }

    async getClientByCPF(CPF: string): Promise<Client>{
        const clientsList = await this.getClients();
        const clientHistoric = clientsList.find((c: Client) => c.cpf === CPF);

        if (!clientHistoric) {
            throw new Error('Client not found.' );
        }

        return clientHistoric;
    }

    async getWinesByType(type: string): Promise<Purchase[]> {
        const purchaseList = await PurchaseController.getPurchases();
        return purchaseList.filter((item: Purchase) => item.tipo_vinho === type);
    }

}

export default new ClientController()