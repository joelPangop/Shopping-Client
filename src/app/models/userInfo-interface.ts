import {Address} from './address-interface';
import {Telephone} from './telephone-interface';
import {Device} from './device-interface';

export interface UserInfo {
    lastName?: string;
    firstName?: string;
    gender?: string;
    telephones?: Telephone[];
    devices?: Device[];
    address?: Address;
    subscription: any;
}
