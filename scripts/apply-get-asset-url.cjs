const fs = require('fs');

// 1. Process src/data/clubsData.ts
let clubsData = fs.readFileSync('w:/sitestrike1/src/data/clubsData.ts', 'utf8');
if (!clubsData.includes('getAssetUrl')) {
  clubsData = `import { getAssetUrl } from '../utils/asset';\n` + clubsData;
}
// Replace "./photos/..." -> getAssetUrl("photos/...")
// Replace "./media/..." -> getAssetUrl("media/...")
// Replace "./renders/..." -> getAssetUrl("renders/...")
// Replace "./smartgamer.webp" -> getAssetUrl("smartgamer.webp")
clubsData = clubsData.replace(/(['"])\.\/(photos|media|renders|smartgamer\.webp)([^'"]*)\1/g, 'getAssetUrl("$2$3")');
fs.writeFileSync('w:/sitestrike1/src/data/clubsData.ts', clubsData, 'utf8');
console.log('Processed clubsData.ts');

// 2. Process src/App.tsx
let app = fs.readFileSync('w:/sitestrike1/src/App.tsx', 'utf8');
if (!app.includes('getAssetUrl')) {
  app = `import { getAssetUrl } from './utils/asset';\n` + app;
}
app = app.replace(/(['"])\.\/(photos|media|renders|smartgamer\.webp)([^'"]*)\1/g, 'getAssetUrl("$2$3")');
fs.writeFileSync('w:/sitestrike1/src/App.tsx', app, 'utf8');
console.log('Processed App.tsx');

// 3. Process src/components/ClubView.tsx
let clubView = fs.readFileSync('w:/sitestrike1/src/components/ClubView.tsx', 'utf8');
if (!clubView.includes('getAssetUrl')) {
  clubView = `import { getAssetUrl } from '../utils/asset';\n` + clubView;
}
clubView = clubView.replace(/(['"])\.\/(photos|media|renders|smartgamer\.webp)([^'"]*)\1/g, 'getAssetUrl("$2$3")');
fs.writeFileSync('w:/sitestrike1/src/components/ClubView.tsx', clubView, 'utf8');
console.log('Processed ClubView.tsx');

// 4. Process src/components/BookingModal.tsx
let modal = fs.readFileSync('w:/sitestrike1/src/components/BookingModal.tsx', 'utf8');
if (!modal.includes('getAssetUrl')) {
  modal = `import { getAssetUrl } from '../utils/asset';\n` + modal;
}
modal = modal.replace(/(['"])\.\/(photos|media|renders|smartgamer\.webp)([^'"]*)\1/g, 'getAssetUrl("$2$3")');
fs.writeFileSync('w:/sitestrike1/src/components/BookingModal.tsx', modal, 'utf8');
console.log('Processed BookingModal.tsx');
