import { InitOption } from './types/core.type';
import { EventEmitter2 } from 'eventemitter2';
declare class Core extends EventEmitter2 {
    private middleware;
    private context;
    private runtime;
    env: string;
    autopv: string;
    duration: number;
    url: string;
    pageUrl: string;
    pageId: string;
    channel: string;
    ignore: any;
    pageView: any;
    constructor(opt: any);
    toJSON(): Core;
    inspect(): Core;
    private callback();
    private createContext();
    start(...args: any[]): Core;
    set(opt: InitOption): Core;
    use(lambda: (...args: any[]) => any): Core;
    private beat();
}
export default Core;
