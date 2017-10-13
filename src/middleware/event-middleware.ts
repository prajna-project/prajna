function eventMiddleware(ctx: any, next: any): any {
    console.log('use event-middleware');
    next();
}

export default eventMiddleware;
