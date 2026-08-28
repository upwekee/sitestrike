const fs = require('fs');
const path = require('path');

const files = [
  'w:/sitestrike1/src/data/clubsData.ts',
  'w:/sitestrike1/src/App.tsx',
  'w:/sitestrike1/src/components/ClubView.tsx',
  'w:/sitestrike1/src/components/PhotoLightbox.tsx',
  'w:/sitestrike1/src/components/BookingModal.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace quotes with /photos, /media, /renders, /smartgamer.webp
  content = content.replace(/(['"])\/(photos|media|renders|smartgamer\.webp)/g, '$1./$2');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
});
