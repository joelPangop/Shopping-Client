import {UserInfo} from './userInfo-interface';
import {RoleType} from './roleType';

export interface Utilisateur {
    role?: RoleType;
    username: string;
    email ?: string;
    contact?: string;
    avatar ?: string;
    type ?: string;
    password ?: string;
    userInfo: UserInfo;
    _id ?: string;
}
