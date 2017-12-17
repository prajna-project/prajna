enum Category {
    PV = 'pv', // 页面PV
    PD = 'pd', // 页面PD
    AJAX = 'xhr', // ajax请求
    RESOURCE = 'resource', // 资源加载

    JS_ERROR = 'jsError', // js报错
    REPORT = 'jsReport', // 手动上报
    MODULE_CLICK = 'moduleClick',
    MODULE_VIEW = 'moduleView',
    MODULE_EDIT = 'moduleEdit',

}

export enum CacheKey {
    PV = 'prajna_cache_pv', // 页面PV
    PD = 'prajna_cache_pd', // 页面PD
    AJAX = 'prajna_cache_xhr', // ajax请求
    RESOURCE = 'prajna_cache_resource', // 资源加载

    JS_ERROR = 'prajna_cache_js', // js报错
    REPORT = 'prajna_cache_log', // 手动上报
    MODULE_CLICK = 'prajna_cache_log',
    MODULE_VIEW = 'prajna_cache_log',
    MODULE_EDIT = 'prajna_cache_log',
}

export default Category;
