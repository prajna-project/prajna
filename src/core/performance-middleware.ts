const Global: Window = window;

function performanceMiddleware(ctx: any, next: any): any {
    console.log(Global.performance);
    return;
}

export default performanceMiddleware;
