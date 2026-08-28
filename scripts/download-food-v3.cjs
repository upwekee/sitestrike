const https = require('https');
const fs = require('fs');
const path = require('path');

const foodDir = path.join(__dirname, '..', 'public', 'media', 'food');

const images = {
  // Real Chinese Tea ceremony with teapot, tray, clay cups
  'tea-ceremony.jpg': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=85',
  'tea-chinese.jpg': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=85',
  'tea-teapot-glass.jpg': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=85',
  'tea-teapot-ceremony.jpg': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=85',
  'tea-herbal-berries.jpg': 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800&auto=format&fit=crop&q=85',
  'tea-oolong-gaiwan.jpg': 'https://images.unsplash.com/photo-1571934811356-5cc597491d90?w=800&auto=format&fit=crop&q=85',

  // Fried dumplings / Chebupeli
  'chebupeli-crispy.jpg': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=85',
  'chebupeli-plate.jpg': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=85',

  // Chebupizza / Pizza pockets
  'chebupizza-hot.jpg': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=85',

  // Cheburek / Crispy turnover pastry
  'cheburek-fried.jpg': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=85',
  'cheburek-pastry.jpg': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=85',
};

function download(filename, url) {
  return new Promise((resolve) => {
    const dest = path.join(foodDir, filename);
    const file = fs.createWriteStream(dest);

    const get = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          console.error(`Failed ${filename}: status ${res.statusCode}`);
          resolve();
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.log(`Saved ${filename}`);
            resolve();
          });
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        console.error(`Error ${filename}: ${err.message}`);
        resolve();
      });
    };
    get(url);
  });
}

async function run() {
  for (const [filename, url] of Object.entries(images)) {
    await download(filename, url);
  }
  console.log("Downloads complete!");
}

run();
