const fs = require('fs');
const js = fs.readFileSync('w:/sitestrike1/dist/assets/index-D_Lzhqh2.js', 'utf8');

console.log('Includes getAssetUrl:', js.includes('getAssetUrl'));
console.log('Includes BASE_URL:', js.includes('BASE_URL'));
console.log('Includes /sitestrike/:', js.includes('/sitestrike/'));
