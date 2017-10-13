function XHRMiddleware(ctx: any, next: any): any {
    console.log('use xhr-middleware');
    next();
}

export default XHRMiddleware;
