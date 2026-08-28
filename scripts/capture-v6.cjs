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

        // 1. Capture Navbar
        const navShot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 1600, height: 120, scale: 1 },
          captureBeyondViewport: true
        });
        if (navShot && navShot.data) {
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/navbar_v6_no_vk.png', Buffer.from(navShot.data, 'base64'));
          console.log("Saved navbar_v6_no_vk.png");
        }

        // 2. Hover over first club card and capture clubs section
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.getElementById('clubs');
              if (el) el.scrollIntoView({ behavior: 'instant' });
            })()
          `
        });
        await new Promise(r => setTimeout(r, 500));

        // Hover over first card
        const cardBox = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const card = document.querySelector('#clubs .group');
              if (!card) return null;
              const r = card.getBoundingClientRect();
              return JSON.stringify({ x: r.left + r.width/2, y: r.top + r.height/2 });
            })()
          `,
          returnByValue: true
        });

        if (cardBox && cardBox.result && cardBox.result.value) {
          const pt = JSON.parse(cardBox.result.value);
          await send('Input.dispatchMouseEvent', {
            type: 'mouseMoved',
            x: pt.x,
            y: pt.y
          });
        }
        await new Promise(r => setTimeout(r, 600));

        const clubsRect = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.getElementById('clubs');
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return JSON.stringify({ x: 0, y: r.top + window.scrollY, width: 1600, height: r.height });
            })()
          `,
          returnByValue: true
        });

        if (clubsRect && clubsRect.result && clubsRect.result.value) {
          const rect = JSON.parse(clubsRect.result.value);
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: { x: 0, y: rect.y, width: 1600, height: rect.height, scale: 1 },
            captureBeyondViewport: true
          });
          if (shot && shot.data) {
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/clubs_v6_hover_glow.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved clubs_v6_hover_glow.png");
          }
        }

        // 3. Capture Pricing section (full table with PC + PS5)
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
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/pricing_v6_clean.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved pricing_v6_clean.png");
          }
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
