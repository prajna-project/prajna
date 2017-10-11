function reportMiddleware(ctx: any, next: any): any {
    console.log('report-middleware');
    next();
}

export default reportMiddleware;
