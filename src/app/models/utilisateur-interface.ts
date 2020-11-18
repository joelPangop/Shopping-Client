import {UserInfo} from './userInfo-interface';
import {RoleType} from './roleType';
import {Store} from './store-interface';
import {File} from './file-interface';

export interface Utilisateur {
    role?: RoleType;
    username: string;
    email ?: string;
    contact?: string;
    avatar ?: File;
    type ?: string;
    password ?: string;
    userInfo?: UserInfo;
    currency?: Currency;
    customer_profile?: any;
    payment_account?: any;
    bank_account?: any[];
    verified?: boolean;
    _id ?: string;
}

export interface Currency {
    currency: string,
    icon: string;
}

export interface Bank {
    bank_account?: any;
    appartNumber: string;
}
