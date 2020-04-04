import {Injectable} from '@angular/core';
 import {NetworkInterface} from '@ionic-native/network-interface/ngx';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IpAddressService {

    public ipAddress;

    constructor(public networkinterface: NetworkInterface) {
       this.loadIPAddress();
    }

    loadIPAddress() {
        // @ts-ignore
        this.networkinterface.getWiFiIPAddress((ip) => {
            console.log(ip);
            this.ipAddress = ip;
        });
    }

}
