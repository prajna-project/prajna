const ls = require('local-storage');
import GLOBAL from '../util/global';

function sendPDData(ctx: any, padding?: any){
    let cache: any = ls.get('prajna_cache');

}
function PDMiddleware(ctx: any, next: any) {
    let startTime: number, duration: number;
    GLOBAL.addEventListener("load", function () {
        console.log('aaaaaaaa')
        startTime = new Date().getTime();
    });
    GLOBAL.addEventListener("beforeunload", function () {
        duration = new Date().getTime() - startTime;
        console.log('bbbbb')
        sendPDData(ctx, {
            duration: duration
        });
    });
    next();
}
export default PDMiddleware;
