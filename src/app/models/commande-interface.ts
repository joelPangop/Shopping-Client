import {itemCart} from './itemCart-interface';
import {OrderStatus} from './OrderStatus';
import {UserInfo} from './userInfo-interface';

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
    checkout_infos: any;
    userInfo: UserInfo;
    paymentIntent:any;
    orders:any[];
}
