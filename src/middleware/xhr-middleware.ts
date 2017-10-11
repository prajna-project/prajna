function XHRMiddleware(ctx: any, next: any): any {
    console.log('xhr-middleware');
    next();
}

export default XHRMiddleware;
