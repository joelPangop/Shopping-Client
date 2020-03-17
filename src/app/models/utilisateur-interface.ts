import {UserInfo} from './userInfo-interface';

export interface Utilisateur {
    username: string;
    email ?: string;
    contact?: string;
    avatar ?: string;
    type ?: string;
    password ?: string;
    userInfo: UserInfo;
    _id ?: string;
}
