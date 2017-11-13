import { Region } from '../core/types/message.type';
const GLOBAL: any = window;

function getCurrentPosition(): Promise<Region> {
    let region: Region = { lng: '', lat: '' };
    return new Promise((resolve, reject) => {
        if (!GLOBAL.navigator.geolocation) {
            reject("Geolocation is not supported by your browser")
        } else {
            GLOBAL.navigator.geolocation.getCurrentPosition((position: any) => {
                region.lng = position.coords.latitude;
                region.lat = position.coords.longitude;
                resolve(region);
            }, (err: any) => {
                reject("getCurrentPosition error")
            });
        }
    });
}

export default getCurrentPosition;
