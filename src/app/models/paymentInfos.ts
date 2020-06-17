import {Utilisateur} from './utilisateur-interface';
import {PaymentMethods} from './PaymentMethods';

export interface PaymentInfos {
    userId: string;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    paymentMethod: PaymentMethods;
}
