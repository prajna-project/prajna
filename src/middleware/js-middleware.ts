const ls = require('local-storage'); // tslint-disable-line

import GLOBAL from '../util/global';
import postXHR from '../util/xhr';

import Category, { CacheKey } from '../core/types/category.type';
import { LogLevel} from '../core/types/log.type';
import Message from '../core/types/message.type';

let FORMER_JSERROR_FLAG: boolean = true;

function _sendJSData(ctx: any) {
    // ctx.core.beat();
    const cache: any = [];
    if (cache.length > 0) {
        _sendRawLogs(cache, ctx, () => {
            ls.set(CacheKey.JS_ERROR, []);
        }, null);
    }
}

function _sendRawLogs(logs: any, ctx: any, sendSuccess: any, sendFail: any) {
    const mergedData: Message[] = [];
    logs.forEach((e: any, i: number) => {
        const raw: Message = ctx.inspect();
        raw.log = {
            unix: +new Date(),
            name: e.message,
            content: e.errorStack,
            level: LogLevel.ERROR,
            pageUrl: ctx.core.pageUrl,
            pageId: ctx.core.pageId,
            padding: {
                lineNumber: e.lineNumber,
                columnNumber: e.columnNumber,
            },
            resourceUrl: e.scriptURL,
        };
        raw.category = Category.JS_ERROR,
        mergedData.push(raw);
    });
    postXHR({
        url: ctx.core.url + '/api/prajna',
        data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=js',
        success: () => {
            if (sendSuccess) {
                sendSuccess();
            }
        },
        failure: () => {
            if (sendFail) {
                sendFail();
            }
        },
    });
}

function _JSRuntime(ctx: any) {
    const globalOnError = GLOBAL.onerror;
    GLOBAL.onerror = (errorMessage: string,
                      scriptURI: string,
                      lineNumber: number,
                      columnNumber: number,
                      errorObj: any) => {
        const logs: any = [];
        let errorStack: string = '';
        if (errorObj && errorObj.stack) {
            errorStack = errorObj.stack;
        }
        logs.push({
            message: errorMessage,
            scriptURL: scriptURI,
            lineNumber,
            columnNumber,
            errorStack,
        });
        if (globalOnError) {
            globalOnError.apply(GLOBAL, arguments);
        }
        _sendRawLogs(logs, ctx, null, () => {
            ls.set(CacheKey.JS_ERROR, []);
        });
        ctx.core.emit(LogLevel.ERROR);
    };
    GLOBAL.addEventListener("unhandledrejection", (event: any) => {
        // gadget
        const logs: any = [];

        let message: string = 'Not Found';
        let scriptURL: string = 'Not Found';
        let errorStack: string = 'Not Found';

        if (event && event.reason) {
            if (event.reason.message) {
                message = event.reason.message;
            }
            if (event.reason.stack) {
                errorStack = event.reason.stack;
            }
        }
        if (event && event.target && event.target.location.href) {
            scriptURL = event.target.location.href;
        }

        logs.push({
            message,
            scriptURL,
            lineNumber: -1,
            columnNumber: -1,
            errorStack,
        });
        if (globalOnError) {
            globalOnError.apply(GLOBAL, arguments);
        }
        _sendRawLogs(logs, ctx, () => {
            ls.set(CacheKey.JS_ERROR, []);
        }, null);
        ctx.core.emit(LogLevel.ERROR);
    });
}

function JSMiddleware(ctx: any, next: any): any {
    if (FORMER_JSERROR_FLAG) {
        FORMER_JSERROR_FLAG = false;
        _JSRuntime(ctx);
        _sendJSData(ctx);
    }
    next();
}

export default JSMiddleware;
