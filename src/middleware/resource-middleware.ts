function resourceMiddleware(ctx: any, next: any): any {
    console.log('resource-middleware');
    next();
}

export default resourceMiddleware;
