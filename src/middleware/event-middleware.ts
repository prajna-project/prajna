function eventMiddleware(ctx: any, next: any): any {
    console.log('event-middleware');
    next();
}

export default eventMiddleware;
