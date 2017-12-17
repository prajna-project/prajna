import GLOBAL from './global';

const Perf: any = GLOBAL.performance;
const getEntries: any = GLOBAL.performance && GLOBAL.performance.getEntries;
const PerformanceObserver: any = GLOBAL.performance && GLOBAL.PerformanceObserver;

export {
    PerformanceObserver,
    Perf,
};
export default getEntries;
