const fs = require('fs');

const files = [
  'w:/sitestrike1/src/App.tsx',
  'w:/sitestrike1/src/components/BookingModal.tsx',
  'w:/sitestrike1/src/components/ClubView.tsx',
  'w:/sitestrike1/src/data/clubsData.ts'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  // Fix JSX attributes: src=getAssetUrl(...) -> src={getAssetUrl(...)}
  content = content.replace(/(src|href)=getAssetUrl\(([^)]+)\)/g, '$1={getAssetUrl($2)}');
  fs.writeFileSync(f, content, 'utf8');
});

console.log('Fixed JSX attributes');
