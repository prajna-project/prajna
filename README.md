# Prajna (प्रज्ञ), analysing browser side javascript application with wisdom

[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.0-beta2&x2=0)](https://www.npmjs.com/package/prajna)


## Overview

## Usage
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

## Documentation
[Wiki](https://github.com/mtdp-diancan-f2e/prajna/wiki)

## License
MIT
