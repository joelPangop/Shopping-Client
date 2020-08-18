import {UserInfo} from './userInfo-interface';
import {RoleType} from './roleType';
import {Store} from './store-interface';

export interface Utilisateur {
    role?: RoleType;
    username: string;
    email ?: string;
    contact?: string;
    avatar ?: string;
    type ?: string;
    password ?: string;
    userInfo?: UserInfo;
    currency?: Currency;
    customer_profile?: any;
    _id ?: string;
}

export interface Currency {
    currency: string,
    icon: string;
}
