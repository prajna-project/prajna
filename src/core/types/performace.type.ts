// TODO: performace 可以通过 now 进行打点

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

export enum NavigationType {
    TYPE_NAVIGATENEXT,
    TYPE_RELOAD,
    TYPE_BACK_FORWARD,
    TYPE_UNDEFINED = 255
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

export default interface Performance {
    pageUrl: string,            // 页面 url
    timing: Timing,
    navigation?: Navigation
    memory?: Memory
}
