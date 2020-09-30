import {NetworkInterface} from '@ionic-native/network-interface/ngx';

// export let ipAddress: any;

export abstract class Utils {
public ipAddress: any;
    // constructor(public networkinterface: NetworkInterface) {
    //     // @ts-ignore
    //     this.networkinterface.getWiFiIPAddress((ip) => {
    //         // @ts-ignore
    //         ipAddress = ip;
    //     });
    // }

    static contains(target, pattern) {
        let value = 0;
        if (target && pattern) {
            pattern.forEach(function(word) {
                value = value + target.includes(word);
            });
        }
        return (value > 1);
    }

    static makeString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
