function resourceMiddleware(ctx: any, next: any): any {
    console.log('use resource-middleware');
    next();
}

export default resourceMiddleware;
