const https = require('https');
const fs = require('fs');
const path = require('path');

const foodDir = path.join(__dirname, '..', 'public', 'media', 'food');

const images = {
  'snack-fries.jpg': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
  'drink-flash.jpg': 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80',
  'snack-chebupeli.jpg': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
  'snack-noodles.jpg': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
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
  console.log("Remaining downloads complete!");
}

run();
