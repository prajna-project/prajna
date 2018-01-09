var fs = require('fs');
var version = require('../package.json').version;
var json = '{"version":"' + version + '"}';

fs.writeFile('version.json', json, function(err) {
    if (err) {
        console.log(err);
    }
});
