const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const browserPath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const port = 9222;

  const browserProc = spawn(browserPath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1600,1200',
    'http://localhost:8443'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get(`http://127.0.0.1:${port}/json`, async (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const pages = JSON.parse(raw);
      const targetPage = pages.find(p => p.url.includes('localhost:8443') || p.type === 'page');
      if (!targetPage) { browserProc.kill(); return; }

      const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
      let id = 1;
      const send = (method, params = {}) => {
        return new Promise((resolve) => {
          const reqId = id++;
          const handler = (event) => {
            try {
              const msg = typeof event.data === 'string' ? JSON.parse(event.data) : JSON.parse(event.data.toString());
              if (msg.id === reqId) {
                ws.removeEventListener('message', handler);
                resolve(msg.result);
              }
            } catch (e) {}
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id: reqId, method, params }));
        });
      };

      ws.onopen = async () => {
        await send('Runtime.enable');
        await send('Page.enable');
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1600,
          height: 1200,
          deviceScaleFactor: 1,
          mobile: false
        });

        await send('Page.reload');
        console.log("Waiting 3s for render...");
        await new Promise(r => setTimeout(r, 3000));

        // 1. Capture Hero section
        const heroRect = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.getElementById('hero');
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return JSON.stringify({ x: 0, y: r.top + window.scrollY, width: 1600, height: r.height });
            })()
          `,
          returnByValue: true
        });

        if (heroRect && heroRect.result && heroRect.result.value) {
          const rect = JSON.parse(heroRect.result.value);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: { x: 0, y: rect.y, width: 1600, height: rect.height, scale: 1 },
            captureBeyondViewport: true
          });
          if (shot && shot.data) {
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/hero_promobutton.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved hero_promobutton.png");
          }
        }

        // 2. Click on Drinks tab on main food section
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const btns = Array.from(document.querySelectorAll('#food button'));
              const b = btns.find(x => x.textContent.includes('напитки') || x.textContent.includes('Напитки') || x.textContent.includes('Энергетики'));
              if (b) b.click();
            })()
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const foodRect = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.getElementById('food');
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return JSON.stringify({ x: 0, y: r.top + window.scrollY, width: 1600, height: r.height });
            })()
          `,
          returnByValue: true
        });

        if (foodRect && foodRect.result && foodRect.result.value) {
          const rect = JSON.parse(foodRect.result.value);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: { x: 0, y: rect.y, width: 1600, height: rect.height, scale: 1 },
            captureBeyondViewport: true
          });
          if (shot && shot.data) {
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/drinks_updated.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved drinks_updated.png");
          }
        }

        // 3. Click club detail
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const btns = Array.from(document.querySelectorAll('#clubs button'));
              const b = btns.find(x => x.textContent.includes('ПОДРОБНЕЕ'));
              if (b) b.click();
            })()
          `
        });
        await new Promise(r => setTimeout(r, 1500));

        const clubShot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 1600, height: 750, scale: 1 },
          captureBeyondViewport: true
        });
        if (clubShot && clubShot.data) {
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/club_page_clean_247.png', Buffer.from(shot = clubShot.data, 'base64'));
          console.log("Saved club_page_clean_247.png");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
