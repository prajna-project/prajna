let XHR_FLAG: boolean = true;
function XHRMiddleware(ctx: any, next: any): any {
    console.log('use xhr-middleware');
    if (XHR_FLAG) {
        XHR_FLAG = false;
    }
    next();
}

export default XHRMiddleware;
