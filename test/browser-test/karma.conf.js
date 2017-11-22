// Karma configuration
// Generated on Tue Nov 07 2017 18:16:40 GMT+0800 (CST)
const webpackConfig = require('./webpack.test.conf');
const sauce = {
    "username": "lavonka",
    "accesskey": "43886c57-4092-4e54-b292-8fc6f84a9986"
};

function isDebug(argument) {
    return argument === '--debug';
}

// 生成 SauceLabs Selenium 配置信息
function configSelenium (browserName, platform, version) {
    return {
        base: 'SauceLabs',
        browserName,
        platform,
        version
    };
}

// 生成 SauceLabs Appium 配置信息
function configAppium (
    browserName,
    platformName,
    platformVersion,
    deviceName
) {
    return {
        base: 'SauceLabs',
        browserName,
        platformName,
        platformVersion,
        deviceName
    };
}

// 定义所有需要在云端测试的平台和浏览器
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
const customLaunchers = {
    // 移动设备浏览器
    // // al_ios_8_safari: configAppium('Safari', 'iOS', '8.1', 'iPhone 6 Plus Simulator'),
    // // al_ios_9_safari: configAppium('Safari', 'iOS', '9.2', 'iPad 2 Simulator'),
    al_ios_10_safari: configAppium('Safari', 'iOS', '10.2', 'iPhone 6 Simulator'),
    al_android_4_2: configAppium('Browser', 'Android', '4.4', 'Android Emulator'),
    // // al_android_5_1: configAppium('Browser', 'Android', '5.1', 'Android Emulator'),
    // al_android_6_0: configAppium('Chrome', 'Android', '6.0', 'Android Emulator'),
    //
    // // 主流桌面浏览器
    // sl_win_chrome: configSelenium('chrome', 'Windows 7'),
    // sl_mac_chrome: configSelenium('chrome', 'OS X 10.10'),
    // sl_safari_9: configSelenium('safari', 'OS X 10.11', '9'),
    // // sl_ie_8: configSelenium('internet explorer', 'Windows 7', '8'),
    // // sl_ie_9: configSelenium('internet explorer', 'Windows 7', '9'),
    // // sl_ie_10: configSelenium('internet explorer', 'Windows 8', '10'),
    // // sl_ie_11: configSelenium('internet explorer', 'Windows 10', '11'),
    // sl_edge: configSelenium('MicrosoftEdge', 'Windows 10')
};

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // list of files / patterns to load in the browser
        files: [
            'specs/index.js'
        ],
        frameworks: ['mocha', 'sinon-chai'],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'specs/index.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: contextHTML.LOG_DISABLE || contextHTML.LOG_ERROR || contextHTML.LOG_WARN || contextHTML.LOG_INFO || contextHTML.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        customContextFile: 'dist/context.html',

        customDebugFile: 'dist/debug.html'
    });

    if (process.argv.some(isDebug)) {
        config.set({
            frameworks: ['mocha-debug'].concat(config.frameworks),

            // enable / disable watching file and executing tests whenever any file changes
            autoWatch: true,

            // Continuous Integration mode
            // if true, Karma captures browsers, runs the tests and exits
            singleRun: false,

            // test results reporter to use
            // possible values: 'dots', 'progress'
            // available reporters: https://npmjs.org/browse/keyword/karma-reporter
            reporters: ['progress', 'apijson'],

            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            browsers: ['Chrome'],
            apiJsonReporter: {
                outputUrl: "http://10.72.247.248:9200/unit-test/json-log"
            }
        });
    } else {
        // 将 SauceLabs 提供的 username 和 accesskey 放到环境变量中
        if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
            process.env.SAUCE_USERNAME = sauce.username;
            process.env.SAUCE_ACCESS_KEY = sauce.accesskey;
        }

        // 设置测试的超时时间
        const maxExecuteTime = 5*60*1000;

        config.set({
            reporters: ['html', 'saucelabs', 'apijson'],

            autoWatch: false,
            singleRun: true,
            // karma-htmlfile-reporter config
            htmlReporter: {
                outputFile: 'reporters/test_result.html',
                pageTitle: 'Browser Tests Result',
                subPageTitle: 'Prajna Browser Tests Result',
                groupSuites: true,
                useCompactStyle: true
            },
            apiJsonReporter: {
                outputUrl: "http://10.72.247.248:9200/unit-test/json-log"
            }
            // 自定义运行测试的 SauceLabs 浏览器
            customLaunchers: customLaunchers,
            browsers: Object.keys(customLaunchers),

            // SauceLabs 的配置，完整的字段可以参考：
            // https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options
            sauceLabs: {
                // 测试结果是否公开，如果希望生成矩阵图，必须是 public
                public: 'public',
                // 是否在测试过程记录虚拟机的运行录像
                recordVideo: false,
                // 是否在测试过程记录虚拟机的图像
                recordScreenshots: false,
                // 测试名称
                testName: 'Cross browsers test',
                // 测试的记录号，可以为任意字符，如果希望生成矩阵图，contextHTML 不能为空
                build: 'contextHTML-' + Date.now()
            },

            // 最大超时时间
            captureTimeout: maxExecuteTime,
            browserNoActivityTimeout: maxExecuteTime,
        });
    }
};
