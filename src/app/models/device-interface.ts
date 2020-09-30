import {DeviceInfo} from '@capacitor/core';

// @ts-ignore
export interface Device extends DeviceInfo{
    _id?:string,
    appBuild: string,
    appId: string,
    appName: string,
    appVersion: string,
    isVirtual: boolean,
    manufacturer: string,
    model: string,
    operatingSystem: string,
    osVersion: string,
    platform: string,
    uuid: string,
}
