import compose from './compose';
import context from './context';
import runtime from './runtime';

import AjaxMiddleware from '../middleware/ajax-middleware';
import EventMiddleware from '../middleware/event-middleware';
import JSMiddleware from '../middleware/js-middleware';
import PDMiddleware from '../middleware/pd-middleware';
import PVMiddleware from '../middleware/pv-middleware';
import ReportMiddleware from '../middleware/report-middleware';
import ResourceMiddleware from '../middleware/resource-middleware';

import { EventEmitter2 } from 'eventemitter2';
import { InitOption } from './types/core.type';

const only = require('only');
const GLOBAL: any = window;

class Core extends EventEmitter2 {
    public env: string = GLOBAL.__prajnaEnv__ || 'beta';
    public autopv: string = GLOBAL.__prajnaAutoPV__;
    public duration: number = 0;
    public url: string = GLOBAL.__envMapping__[this.env];
    public pageUrl: string = GLOBAL.location.href;
    public pageId: string = '';
    // public channel: string = null;
    public ignore: any = { xhr: [], resource: [] };

    private middleware: any[];
    private context: any;
    private runtime: any;

    constructor(opt: any) {
        super();

        this.middleware = [];
        this.context = Object.create(context);
        this.runtime = Object.create(runtime);
        this.pageId = opt.pageId || this.pageId;
        this.pageUrl = opt.pageUrl || this.pageUrl;
        // this.channel = opt.channel || this.channel;
        this.ignore = opt.ignore || this.ignore;
    }

    public toJSON(): Core {
        return only(this, [
            'env',
            'url',
            'autopv',
            'pageUrl',
            'pageId',
            // 'channel'
        ]);
    }

    public inspect(): Core {
        return this.toJSON();
    }

    public start(...args: any[]): Core {
        // console.log('prajna start!');
        this.use(PVMiddleware)
            .use(ResourceMiddleware)
            .use(AjaxMiddleware)
            .use(EventMiddleware)
            .use(JSMiddleware)
            .use(ReportMiddleware)
            .use(PDMiddleware);

        this.on('BEAT_EVENT', this.callback());

        this.beat();			// beat once when start

        return;
    }

    public set(opt: InitOption): Core {
        // Set prajna configurations;
        this.pageId = opt.pageId || this.pageId;
        this.pageUrl = opt.pageUrl || this.pageUrl;
        // this.channel = opt.channel || this.channel;

        return this;
    }

    public use(lambda: (...args: any[]) => any): Core {
        // Install prajna middleware
        this.middleware.push(lambda);

        return this;
    }

    private beat(): Core {
        this.emit('BEAT_EVENT');

        return this;
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

    private createContext(): void {
        const context = Object.create(this.context);
        const runtime = context.runtime = Object.create(this.runtime);

        context.core = runtime.core = this;
        context.state = {};

        return context;
    }
}

function runtimeHelper(ctx: any) {
    return (ctx: any) => {};
}

export default Core;
