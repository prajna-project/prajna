## Prajna (प्रज्ञ), analysing browser side javascript application with wisdom

[![npm version](https://badge.fury.io/js/node-rdkafka.svg)](https://badge.fury.io/js/node-rdkafka)


### Overview

### Usage
```javascript
import Prajna from 'prajna';
var prajna = Prajna.init({
    pageId: 'you-name-it',
    channel: 'browser'
});
this.prajna.use(async (ctx, next) => {
    // do someting
    next();
});
this.prajna.start();
```

### Documentation
[Home](https://github.com/mtdp-diancan-f2e/prajna/wiki)

### License
MIT
