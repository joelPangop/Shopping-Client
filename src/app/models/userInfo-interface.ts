import {Address} from './address-interface';
import {Telephone} from './telephone-interface';

export interface UserInfo {
    lastName: string;
    firstName: string;
    gender: string;
    telephones: Telephone[];
    address: Address;
}
