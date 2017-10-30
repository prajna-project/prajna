const ls = require('local-storage');
import Message from '../core/types/message.type';
import Log, {
    Category,
    LogLevel
} from '../core/types/log.type';

function reportMiddleware(ctx: any, next: any): any {
    ctx.core.report = function () {
        let cache: any = ls.get('prajna_cache') || {};
        let log = cache.log || [];
        let raw = {

        };
        console.log(cache.log);
    };
    next();
}

export default reportMiddleware;
