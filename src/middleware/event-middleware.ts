function eventMiddleware(ctx: any, next: any): any {
    console.log('use event-middleware');
    ctx.core.moduleClick = function () {
        // TODO:
    };

    ctx.core.moduleView = function () {
        // TODO:
    };

    ctx.core.moduleEdit = function () {
        // TODO:
    };

    ctx.core.pageDisappear = function () {
        // sendBeacon
    };
    // ctx.core.order = function (orderid: string) { };
    // ctx.core.pay = function (orderid: string) { };

    next();
}

export default eventMiddleware;
