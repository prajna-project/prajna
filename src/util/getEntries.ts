import GLOBAL from './global';

let Perf: any = GLOBAL.performance;
let getEntries: any = GLOBAL.performance && GLOBAL.performance.getEntries;
let PerformanceObserver: any = GLOBAL.PerformanceObserver;

export {
    PerformanceObserver,
    Perf
};
export default getEntries;
