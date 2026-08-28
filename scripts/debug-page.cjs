const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => console.log('[BROWSER_CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[BROWSER_ERROR]', err.message));
  page.on('requestfailed', req => console.log('[REQ_FAILED]', req.url(), req.failure()?.errorText));

  console.log('Navigating to https://upwekee.github.io/sitestrike/ ...');
  await page.goto('https://upwekee.github.io/sitestrike/', { waitUntil: 'networkidle0', timeout: 30000 });

  const title = await page.title();
  console.log('Page Title:', title);

  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML);
  console.log('Root HTML length:', rootHtml?.length);
  if (!rootHtml || rootHtml.length < 50) {
    console.log('Root HTML is empty or near empty:', rootHtml);
  } else {
    console.log('Root HTML sample:', rootHtml.slice(0, 500));
  }

  // Count images and check naturalWidth
  const imgStats = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));
  });

  console.log('Total images found on page:', imgStats.length);
  console.log('Sample images:', imgStats.slice(0, 10));

  await page.screenshot({ path: 'w:/sitestrike1/live_page_debug.png', fullPage: false });
  console.log('Saved screenshot to w:/sitestrike1/live_page_debug.png');

  await browser.close();
}

main().catch(console.error);
