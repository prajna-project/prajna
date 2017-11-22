import getEntries from '../util/getEntries';
import GLOBAL from '../util/global';

let PAINT_FLAG: boolean = true;

function sendPaintInfo() {

}


function PaintMiddleware(ctx: any, next: any) {
    if (PAINT_FLAG) {
        PAINT_FLAG = false;
        GLOBAL.addEventListener("load", function () {
            setTimeout(() => {
                console.log('paint-middleware');
            }, 0);
        });
    }

}

export default PaintMiddleware;
