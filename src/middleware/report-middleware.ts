import Message from '../core/types/message.type';

function reportMiddleware(ctx: any, next: any): any {
    console.log('use report-middleware');
    next();
}

export default reportMiddleware;
