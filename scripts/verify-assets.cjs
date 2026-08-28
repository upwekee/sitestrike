const fs = require('fs');
const path = require('path');

const srcDir = 'w:/sitestrike1/src';
const publicDir = 'w:/sitestrike1/public';

function scanDir(dir) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) list.push(...scanDir(full));
    else if (/\.(tsx?|jsx?|css|json)$/.test(e.name)) list.push(full);
  }
  return list;
}

const files = scanDir(srcDir);
let allRefs = new Set();
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  const regex = /(?:photos|media|renders|smartgamer)[^"'`)\s]+/g;
  let m;
  while ((m = regex.exec(code)) !== null) {
    allRefs.add(m[0]);
  }
}

console.log('Total referenced assets in src:', allRefs.size);
let missing = [];
let found = [];
for (const ref of allRefs) {
  const clean = ref.replace(/^[./]+/, '');
  const target = path.join(publicDir, clean);
  if (fs.existsSync(target)) {
    found.push(clean);
  } else {
    missing.push(clean);
  }
}

console.log('Found assets count:', found.length);
console.log('Missing assets count:', missing.length);
if (missing.length > 0) {
  console.log('Missing list:', missing);
}
