const http = require('http');
const https = require('https');
const { spawn, execSync } = require('child_process');

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ status: res.statusCode, length: res.headers['content-length'], type: res.headers['content-type'] });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function run() {
  console.log("Checking direct URLs from GitHub Pages:");
  const testUrls = [
    'https://upwekee.github.io/sitestrike/photos/lomonosova/photo-1.jpg',
    'https://upwekee.github.io/sitestrike/photos/20let/photo-1.jpg',
    'https://upwekee.github.io/sitestrike/photos/shilovo/photo-1.jpg',
    'https://upwekee.github.io/sitestrike/media/food/pizza-student.jpg',
    'https://upwekee.github.io/sitestrike/media/food/snack-fries.jpg',
    'https://upwekee.github.io/sitestrike/media/akcii/lomonosov-review.jpg',
    'https://upwekee.github.io/sitestrike/smartgamer.webp'
  ];

  for (const u of testUrls) {
    const res = await checkUrl(u);
    console.log(u.split('/sitestrike/')[1], '-> Status:', res.status, 'Size:', res.length, 'Type:', res.type);
  }
}

run();
