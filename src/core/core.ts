const only = require('only');
import compose from './compose';
import { context } from './context';
import envMiddleware from './env-middleware';
import performanceMiddleware from './performance-middleware';
import Message from './types/message.type';

class Core {
    public middleware: any[];
    public context: any;

    constructor(opt: any) {
        this.middleware = [];
        this.context = Object.create(context);
        this.use(envMiddleware);
        this.use(performanceMiddleware);
    }

    toJSON(): Core { return only(this, []); }

    inspect(): Core { return this.toJSON(); }

    callback(): () => any {		// TODO
        const lambda: (ctx: any, next?: any) => any = compose(this.middleware);
        const handler = () => {
            const ctx = this.createContext();
            return lambda(ctx);
        };
        return handler;
    }

    createContext(): void {		// TODO
        const context = Object.create(this.context);
        context.state = {};
        return context;
    }

    start(...args: any[]): any { // TODO
        console.log('...start');
        this.callback();
        return;
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
        console.log(message);
        return;
    }
}

function reportHelper(ctx: any) {
    console.log('report');
}

function mixin(middleware_a: any, middleware_b: any) {
    let empty = {
    };
    console.log('mixin');
    return empty;
}

export default Core;
export { mixin };
