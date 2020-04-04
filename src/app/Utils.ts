import {NetworkInterface} from '@ionic-native/network-interface/ngx';

// export let ipAddress: any;

export class Utils {
public ipAddress: any;
    constructor(public networkinterface: NetworkInterface) {
        // @ts-ignore
        this.networkinterface.getWiFiIPAddress((ip) => {
            // @ts-ignore
            ipAddress = ip;
        });
    }
}