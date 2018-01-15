# Prajna (प्रज्ञ)
Prajna, Analysing browser side javascript application with wisdom.

[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.0-rc8&x2=0)](https://www.npmjs.com/package/prajna)

## Overview
<!-- [![NPM Stats](https://nodei.co/npm/prajna.png?downloads=true)](https://npmjs.org/package/prajna) -->

Prajna is a in browser supervising and analysing tool which heavily inspired by [Koa](https://github.com/koajs/koa). It can trace your pageview action, resource load action, performance status, javascript error stack, etc, and you can report individual logs to the server url of yours. You can write your own middleware to fetch your own data, form your own log, even add new methods as a plugin. You can read more detail in [Prajna Wiki](https://github.com/mtdp-diancan-f2e/prajna/wiki).

## Usage
- Install and config [prajna-wrapper-plugin](https://github.com/prajna-project/prajna-wrapper-plugin)
```shell
npm install --save prajna-wrapper-plugin
```

- Set up [prajna-wrapper-plugin](https://github.com/prajna-project/prajna-wrapper-plugin) in your webpack.config.js
```javascript
const PrajnaWrapperPlugin = require('prajna-wrapper-plugin');
// ...
plugins: [
    // ...
    new PrajnaWrapperPlugin({
        includes: ['./templates/index.html'],
        options: {
            autopv: true,    // send pageview requests automaticlly
            env: 'dev',
            project: 'your-project-name',
            prajnaServerUrls: {
                'dev': 'http://dev-server-url.com/to/process/prajna/requests',
                'beta': 'http://beta-server-url.com/to/process/prajna/requests',
                'product': 'http://production-server-url.com/to/process/prajna/requests',
            }
        }
    }),
]
```

- Start prajna in your code enterance
```javascript
import Prajna from 'prajna';

var prajna = window.Prajna.init({
    pageId: 'you-name-it',
    channel: 'qrcode'
});

prajna.start();
```

- And there you go
```javascript
prajna.report({
    level: 'ERROR',
    name: 'sample-error',
    content: 'Hello, Prajna!'
});
```

Prajna is published to [CDN](https://cdn.jsdelivr.net/npm/prajna@1.0.0-rc.8/dist/prajna.1.0.0-rc.8.js) by default instead of npm package because Prajna needs to work before npm packages load and start working. The webpack plugin prajna-wrapper-plugin just mentioned serves prajna in the <script></script> tag, you can change the script's src attribute by configure your the webpack.config.js file. the new url of prajna comes from your own build and deployment and you can set up your own server which serves prajna static javascript file using the docker image [youngleehua/prajna]().

## Documentation
Moved to Prajna [Wiki](https://github.com/mtdp-diancan-f2e/prajna/wiki)

## License
MIT
