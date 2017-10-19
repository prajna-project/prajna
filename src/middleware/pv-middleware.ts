const ls = require('local-storage');

function pageView(target: any, key: string, descriptor: any) {
    console.log('decorator');
    return descriptor;
}

function PVMiddleware(ctx: any, next: any): any {
    ctx.core.pageView = function () {
        console.log('PVMiddleware', ls('prajna_cache').pv);
        console.log(ctx.core.autopv);
        // 如果是 autopv ，把所有的
    };
    next();
}

export default PVMiddleware;
