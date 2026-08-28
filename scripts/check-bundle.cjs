const fs = require('fs');
const path = require('path');

const distAssets = fs.readdirSync('w:/sitestrike1/dist/assets');
const jsFile = distAssets.find(f => f.endsWith('.js'));
console.log('Found JS file:', jsFile);

const js = fs.readFileSync(path.join('w:/sitestrike1/dist/assets', jsFile), 'utf8');
const absMatches = js.match(/\/sitestrike\/(photos|media|renders|smartgamer)[^"']+/g);
console.log('Absolute /sitestrike/ matches:', absMatches ? absMatches.length : 0, absMatches?.slice(0, 5));

const relMatches = js.match(/\.\/(photos|media|renders|smartgamer)[^"']+/g);
console.log('Relative ./ matches:', relMatches ? relMatches.length : 0, relMatches?.slice(0, 5));
