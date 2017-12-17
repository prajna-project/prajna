const ls = require('local-storage');

import GLOBAL from '../util/global';
import { match } from '../util/utils';
import postXHR from '../util/xhr';

import Ajax from '../core/types/ajax.type';
import Category, { CacheKey } from '../core/types/category.type';
import { LogLevel } from '../core/types/log.type';
import Message from '../core/types/message.type';

let XHR_FLAG: boolean = true;

function _sendStorage(ctx: any): void {
    const cache: any = ls.get(CacheKey.AJAX) || [];
    if (cache.length) {
        const mergedData: Message[] = [];

        cache.forEach((e: Ajax, i: number) => {
            if (match(e.resourceUrl, ctx.core.ignore.ajax) === false) {
                const raw = ctx.inspect();
                e.pageId = ctx.core.pageId;
                e.pageUrl = GLOBAL.location.href;
                raw.xhr = e;
                mergedData.push(raw);
            }
        });

        if (mergedData.length) {
            postXHR({
                url: ctx.core.url + '/api/prajna',
                data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=xhr',
                success: () => {
                    ls.set(CacheKey.AJAX, []);
                },
            });
        }
    }
}

function _xhrRuntime(ctx: any): void {
    GLOBAL.addEventListener("load", () => {
        GLOBAL.__XHR_ON_LOAD__ = true;
        _sendStorage(ctx);
    });

    const xhr: any = GLOBAL.XMLHttpRequest;
    const xhrSend: any = xhr.prototype.send;
    const xhrInstance: Ajax = {
        resourceUrl: '',
        unix: 0,
        status: 0,
        responsetime: 0,
        pageId: ctx.core.pageId,
        pageUrl: GLOBAL.location.href,
    };
    xhr.prototype.send = function() {
        if (GLOBAL.__prajnaHosts && match(this.url, GLOBAL.__prajnaHosts) === false) {
            console.log(this);
            this.addEventListener('readystatechange', function() {
                xhrInstance.resourceUrl = this.url;
                xhrInstance.unix = +new Date();
                switch (this.readyState) {
                    case 1: // OPENED
                    case 2: // HEADERS_RECEIVED
                    case 3: // LOADING
                        break;
                    case 4: // DONE
                        const mergedData: Message[] = [];
                        const raw: Message = ctx.inspect();

                        xhrInstance.status = this.status;
                        xhrInstance.responsetime = +new Date() - xhrInstance.unix; // - xhrInstance.responsetime?

                        raw.xhr = xhrInstance;
                        raw.category = Category.AJAX;

                        mergedData.push(raw);

                        if (mergedData.length) {
                            postXHR({
                                url: ctx.core.url + '/api/prajna',
                                data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=xhr',
                                success: () => {
                                    ls.set(CacheKey.AJAX, []);
                                },
                                failure: () => {
                                    ls.set(CacheKey.AJAX, []);
                                },
                            });
                        }
                        // 0 - cors fail
                        if (xhrInstance.status === 0 || xhrInstance.status >= 400) {
                            ctx.core.emit(LogLevel.ERROR);
                        }
                        break;
                    default:
                        break;
                }
            });
        }
        return xhrSend.apply(this, arguments);
    };
}

function AjaxMiddleware(ctx: any, next: any): any {
    if (XHR_FLAG) {
        XHR_FLAG = false;
        _xhrRuntime(ctx);
    }
    next();
}

export default AjaxMiddleware;
