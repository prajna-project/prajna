export enum NavigationType {
    TYPE_NAVIGATENEXT,
    TYPE_RELOAD,
    TYPE_BACK_FORWARD,
    TYPE_UNDEFINED = 255
}

export interface PerformanceNavigationTiming {
    name: string,
    entryType: string,
    startTime: number,
    duration: number,
    initiatorType: string,
    nextHopProtocol: string,
    workerStart: number,
    redirectStart: number,
    redirectEnd: number,
    fetchStart: number,
    domainLookupStart: number,
    domainLookupEnd: number,
    connectStart: number,
    connectEnd: number,
    secureConnectionStart: number,
    requestStart: number,
    responseStart: number,
    responseEnd: number,
    transferSize: number,
    encodedBodySize: number,
    decodedBodySize: number,
    serverTiming: any[],
    unloadEventStart: number,
    unloadEventEnd: number,
    domInteractive: number,
    domContentLoadedEventStart: number,
    domContentLoadedEventEnd: number,
    domComplete: number,
    loadEventStart: number,
    loadEventEnd: number,
    type: string,
    redirectCount: number
}

export interface PerformanceResourceTiming {
    name: string,
    entryType: string,
    startTime: number,
    duration: number,
    initiatorType: string,
    nextHopProtocol: string,
    workerStart: number,
    redirectStart: number,
    redirectEnd: number,
    fetchStart: number,
    domainLookupStart: number,
    domainLookupEnd: number,
    connectStart: number,
    connectEnd: number,
    secureConnectionStart: number,
    requestStart: number,
    responseStart: number,
    responseEnd: number,
    transferSize: number,
    encodedBodySize: number,
    decodedBodySize: number,
    serverTiming: any[]
}

export interface PerformancePaintTiming {
    duration: number,
    entryType: string,
    name: string,
    startTime: number
}

export interface Timing {
    connectEnd: number,
    connectStart: number,
    domComplete: number,
    domContentLoadedEventEnd: number,
    domContentLoadedEventStart: number,
    domInteractive: number,
    domLoading: number,
    domainLookupEnd: number,
    domainLookupStart: number,
    fetchStart: number,
    loadEventEnd: number,
    loadEventStart: number,
    navigationStart?: number,
    redirectEnd: number,
    redirectStart: number,
    requestStart: number,
    responseEnd: number,
    responseStart: number,
    secureConnectionStart?: number,
    unloadEventStart: number,
    unloadEventEnd: number
}

export interface Navigation {
    type: NavigationType,
    redirectCount: number
}

export interface Memory {
    jsHeapSizeLimit: number,
    totalJSHeapSize: number,
    usedJSHeapSize: number
}

export interface FPS {
    framesLastSecond: number
}

export interface FRMS {
    frameRenderMilliseconds: number // 每一帧渲染需要的毫秒数
}

export default interface Performance {
    pageUrl: string,
    timing?: Timing,
    navigation?: Navigation,
    memory?: Memory,
    performanceNavigationTiming?: PerformanceNavigationTiming,
    performanceResourceTiming?: PerformanceResourceTiming,
    performancePaintTiming?: PerformancePaintTiming[]
    fps?: FPS,
    frms?: FRMS
}
