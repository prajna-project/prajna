# Prajna (प्रज्ञ)

[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.0-beta4&x2=0)](https://www.npmjs.com/package/prajna)


## Overview
Prajna, Analysing browser side javascript application with wisdom

## Usage
```javascript
import Prajna from 'prajna';

var prajna = Prajna.init({
    pageId: 'you-name-it',
    channel: 'browser'
});

this.prajna.use(async (ctx, next) => {
    // use a middleware
    next();
});

this.prajna.start();
```

## Documentation
[Wiki](https://github.com/mtdp-diancan-f2e/prajna/wiki)

## License
MIT
