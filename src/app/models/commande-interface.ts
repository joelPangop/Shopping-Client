import {itemCart} from './itemCart-interface';
import {OrderStatus} from './OrderStatus';

export interface Commande {
    _id: string;
    userId: string;
    num_commande?: number;
    itemsCart: itemCart[];
    quantity: number;
    amount: number;
    completed: boolean;
    status?: OrderStatus;
    trackingNumber?: string;
    shipmentFee: number;
    createdAt: Date;
    updatedAt: Date;
}
