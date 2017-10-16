const Global: Window = window;

function performanceMiddleware(ctx: any, next: any): any {
    ctx.runtime.performance = Global.performance;
    console.log('use performance-middleware');
    next();
}

export default performanceMiddleware;
