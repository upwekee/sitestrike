const fs = require('fs');
const js = fs.readFileSync('w:/sitestrike1/dist/assets/index-D_Lzhqh2.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('lomonosova', idx)) !== -1) {
  console.log('Context:', js.slice(Math.max(0, idx - 40), Math.min(js.length, idx + 60)));
  idx += 10;
  if (idx > 1000000) break;
}
