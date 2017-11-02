import compose from './compose';
import context from './context';
import runtime from './runtime';
import eventMiddleware from '../middleware/event-middleware';
import PVMiddleware from '../middleware/pv-middleware';
import reportMiddleware from '../middleware/report-middleware';
import resourceMiddleware from '../middleware/resource-middleware';
import XHRMiddleware from '../middleware/xhr-middleware';
import JSMiddleware from '../middleware/js-middleware';

import Message from './types/message.type';
import { InitOption } from './types/core.type';
import { EventEmitter2 } from 'eventemitter2';

const only = require('only');
const GLOBAL: any = window;

class Core extends EventEmitter2 {
    private middleware: any[];
    private context: any;
    private runtime: any;
    public env: string = GLOBAL.__prajnaEnv__ || 'dev';
    public autopv: string = GLOBAL.__prajnaAutoPV__;
    public duration: number = 0;
    public url: string = GLOBAL.__envMapping__[this.env];
    public pageUrl: string = GLOBAL.location.href;
    public pageId: string = '';
    public channel: string = null;
    public pageView: any;

    constructor(opt: any) {
        super();

        this.middleware = [];
        this.context = Object.create(context);
        this.runtime = Object.create(runtime);
        this.pageId = opt.pageId || this.pageId;
        this.pageUrl = opt.pageUrl || this.pageUrl;
        this.channel = opt.channel || this.channel;
    }

    public toJSON(): Core {
        return only(this, [
            'env',
            'url',
            'autopv',
            'pageUrl',
            'pageId',
            'channel'
        ]);
    }

    public inspect(): Core {
        return this.toJSON();
    }

    private callback(): () => any {		// TODO
        const lambda: (ctx: any, next?: any) => any = compose(this.middleware);
        const handler = () => {
            const ctx = this.createContext();
            const handleRuntime = () => runtimeHelper(ctx);
            return lambda(ctx).then(handleRuntime).catch((err: Error) => {
                console.log(err);
            });
        };

        return handler;
    }

    private createContext(): void {		// TODO
        const context = Object.create(this.context);
        const runtime = context.runtime = Object.create(this.runtime);

        context.core = runtime.core = this;
        context.state = {};

        return context;
    }

    public start(...args: any[]): Core {
        this.use(PVMiddleware)
            .use(resourceMiddleware)
            .use(XHRMiddleware)
            .use(eventMiddleware)
            .use(JSMiddleware)
            .use(reportMiddleware);

        this.on('BEAT_EVENT', this.callback());

        this.beat();			// beat once when start

        return;
    }

    public set(opt: InitOption): Core {
        `Set prajna configurations`
        this.pageId = opt.pageId || this.pageId;
        this.pageUrl = opt.pageUrl || this.pageUrl;
        this.channel = opt.channel || this.channel;

        return this;
    }

    public use(lambda: (...args: any[]) => any): Core {
        `Install prajna middleware`
        this.middleware.push(lambda);

        return this;
    }

    private beat(): Core {
        this.emit('BEAT_EVENT');

        return this;
    }
}

function runtimeHelper(ctx: any) {
    return (ctx: any) => { };
}

export default Core;
