const https = require('https');
const fs = require('fs');
const path = require('path');

const foodDir = path.join(__dirname, '..', 'public', 'media', 'food');
if (!fs.existsSync(foodDir)) {
  fs.mkdirSync(foodDir, { recursive: true });
}

// Unsplash high quality food / drink photos (optimized 600px width)
const images = {
  'pizza-student.jpg': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
  'pizza-margherita.jpg': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
  'pizza-ham-mushrooms.jpg': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
  'pizza-meat.jpg': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
  'snack-fries.jpg': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
  'snack-sandwich.jpg': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  'snack-nuggets.jpg': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
  'snack-hotdog.jpg': 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
  'drink-monster.jpg': 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80',
  'drink-redbull.jpg': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'drink-cola.jpg': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
  'tea-puer.jpg': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
  'tea-dahongpao.jpg': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  'tea-oolong.jpg': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80',
  'tea-berries.jpg': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&auto=format&fit=crop&q=80',
};

function download(filename, url) {
  return new Promise((resolve, reject) => {
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
  console.log("All food downloads complete!");
}

run();
