import GLOBAL from './global';

let getEntries: any = GLOBAL.performance.getEntries;
let PerformanceObserver: any = GLOBAL.PerformanceObserver;

export {
    PerformanceObserver
};
export default getEntries;
