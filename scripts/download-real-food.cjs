const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const foodDir = path.join(__dirname, '..', 'public', 'media', 'food');

const images = {
  // Real Authentic Chinese Tea Ceremony
  'tea-ceremony-gongfu.jpg': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=85',
  'tea-ceremony-puer.jpg': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=85',
  'tea-ceremony-glass.jpg': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&auto=format&fit=crop&q=85',
  'tea-ceremony-leaves.jpg': 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=800&auto=format&fit=crop&q=85',

  // Fried dumplings / Чебупели (golden crispy fried mini meat dumplings)
  'chebupeli-real.jpg': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=85',
  'chebupeli-fried.jpg': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=85',

  // Чебупицца (baked calzone / pizza puffs with cheese & pepperoni)
  'chebupizza-real.jpg': 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&auto=format&fit=crop&q=85',
  'chebupizza-pocket.jpg': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=85',

  // Чебурек (Traditional large crispy fried turnover with bubbly dough)
  'cheburek-real.jpg': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=85',
  'cheburek-golden.jpg': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=85',
};

function download(filename, url) {
  return new Promise((resolve) => {
    const dest = path.join(foodDir, filename);
    const file = fs.createWriteStream(dest);

    const get = (targetUrl) => {
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, (res) => {
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
        console.error(`Error downloading ${filename}: ${err.message}`);
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
  console.log("All precise food and tea downloads finished!");
}

run();
