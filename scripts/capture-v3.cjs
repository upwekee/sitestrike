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

        // 1. Capture Clubs section
        const clubsRect = await send('Runtime.evaluate', {
          expression: `
            const el = document.getElementById('clubs');
            if (el) {
              const r = el.getBoundingClientRect();
              JSON.stringify({ x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height });
            } else null;
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
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/clubs_v3_live.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved clubs_v3_live.png");
          }
        }

        // 2. Capture Pricing section
        const priceRect = await send('Runtime.evaluate', {
          expression: `
            const el = document.getElementById('pricing');
            if (el) {
              const r = el.getBoundingClientRect();
              JSON.stringify({ x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height });
            } else null;
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

        // 3. Switch to snacks and capture
        await send('Runtime.evaluate', {
          expression: `
            const buttons = Array.from(document.querySelectorAll('#food button'));
            const snacksBtn = buttons.find(b => b.textContent.includes('снеки') || b.textContent.includes('Снеки'));
            if (snacksBtn) snacksBtn.click();
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const foodRect = await send('Runtime.evaluate', {
          expression: `
            const el = document.getElementById('food');
            if (el) {
              const r = el.getBoundingClientRect();
              JSON.stringify({ x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height });
            } else null;
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
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/snacks_v3_live.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved snacks_v3_live.png");
          }
        }

        // 4. Switch to tea and capture
        await send('Runtime.evaluate', {
          expression: `
            const buttons = Array.from(document.querySelectorAll('#food button'));
            const teaBtn = buttons.find(b => b.textContent.includes('чай') || b.textContent.includes('Чай'));
            if (teaBtn) teaBtn.click();
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const teaShot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: JSON.parse(foodRect.result.value).y, width: 1600, height: JSON.parse(foodRect.result.value).height, scale: 1 },
          captureBeyondViewport: true
        });
        if (teaShot && teaShot.data) {
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/tea_v3_live.png', Buffer.from(teaShot.data, 'base64'));
          console.log("Saved tea_v3_live.png");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
