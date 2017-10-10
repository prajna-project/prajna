import compose from './compose';
import { context } from './context';
import envMiddleware from './env-middleware';
import performanceMiddleware from './performance-middleware';
import Message from './types/message.type';
import { EventEmitter2 } from 'eventemitter2';

const only = require('only');
const debug = require('debug')('prajna:core');
const datascript = require('datascript');

class Core extends EventEmitter2 {
    private middleware: any[];
    private context: any;
    public env: string = 'beta';
    public url: string = 'https://prajna.51ping.com';
    public performanceFlag: boolean = false;
    public autopv: boolean = true;

    constructor(opt: any) {
        super();

        this.middleware = [];
        this.context = Object.create(context);
        this.autopv = opt.autopv || this.autopv;
    }

    toJSON(): Core {
        return only(this, [
            'env',
            'url',
            'performanceFlag',
            'autopv'
        ]);
    }

    inspect(): Core {
        return this.toJSON();
    }

    callback(): () => any {		// TODO
        const lambda: (ctx: any, next?: any) => any = compose(this.middleware);
        const handler = () => {
            const ctx = this.createContext();
            const handleEnv = () => envHelper(ctx);
            return lambda(ctx).then(handleEnv).catch((err: any) => {
                console.log(err);
            });
        };
        return handler;
    }

    createContext(): void {		// TODO
        const context = Object.create(this.context);
        context.state = {};
        return context;
    }

    start(...args: any[]): Core {
        debug('start');
        // this.use(envMiddleware);
        // this.use(performanceMiddleware);
        return this.on('LOGGING', this.callback());
    }

    set(...args: any[]): void {
        `Set prajna configurations`
        return;
    }

    use(lambda: (...args: any[]) => any): Core {
        `Install prajna middleware`
        this.middleware.push(lambda);
        return this;
    }

    // @pageView
    pageView(): void {
        `Send PV manually`
        return;
    }

    // TODO: @prajnaEvent
    prajnaEvent(message: Message): void {
        `Aftermath of page events`
        return;
    }

    report(message: Message): void {
        `Report ERROR|WARNING|INFO|DEBUG info`
        this.emit('LOGGING')
        console.log(message);
        return;
    }
}

function envHelper(ctx: any) {
    return (ctx: any) => { };
}

function mixin(middleware_a: any, middleware_b: any) {
    let empty = {};
    return empty;
}

export default Core;
export { mixin };
