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

        // 1. Capture Pricing section
        const priceRect = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.getElementById('pricing');
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return JSON.stringify({ x: 0, y: r.top + window.scrollY, width: 1600, height: r.height });
            })()
          `,
          returnByValue: true
        });

        if (priceRect && priceRect.result && priceRect.result.value) {
          const rect = JSON.parse(priceRect.result.value);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: { x: 0, y: rect.y, width: 1600, height: rect.height, scale: 1 },
            captureBeyondViewport: true
          });
          if (shot && shot.data) {
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/pricing_v3_live.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved pricing_v3_live.png");
          }
        }

        // 2. Click snacks button and capture
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const btns = Array.from(document.querySelectorAll('#food button'));
              const b = btns.find(x => x.textContent.includes('снеки') || x.textContent.includes('Снеки'));
              if (b) b.click();
            })()
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const snacksRect = await send('Runtime.evaluate', {
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

        if (snacksRect && snacksRect.result && snacksRect.result.value) {
          const rect = JSON.parse(snacksRect.result.value);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: { x: 0, y: rect.y, width: 1600, height: rect.height, scale: 1 },
            captureBeyondViewport: true
          });
          if (shot && shot.data) {
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/snacks_v3_live.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved snacks_v3_live.png");
          }
        }

        // 3. Click tea button and capture
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const btns = Array.from(document.querySelectorAll('#food button'));
              const b = btns.find(x => x.textContent.includes('чай') || x.textContent.includes('Чай'));
              if (b) b.click();
            })()
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const teaRect = await send('Runtime.evaluate', {
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

        if (teaRect && teaRect.result && teaRect.result.value) {
          const rect = JSON.parse(teaRect.result.value);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: { x: 0, y: rect.y, width: 1600, height: rect.height, scale: 1 },
            captureBeyondViewport: true
          });
          if (shot && shot.data) {
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/tea_v3_live.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved tea_v3_live.png");
          }
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
