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
        console.log("Waiting 3s for main page render...");
        await new Promise(r => setTimeout(r, 3000));

        // 1. Capture clean Clubs section
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
            fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/clubs_clean_photos.png', Buffer.from(shot.data, 'base64'));
            console.log("Saved clubs_clean_photos.png");
          }
        }

        // 2. Click on the first club card "ПОДРОБНЕЕ О КЛУБЕ"
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

        // Capture top portion of Club Detail view (showing Hero, In-page Nav, and Pricing first!)
        const clubPageShot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 1600, height: 1800, scale: 1 },
          captureBeyondViewport: true
        });
        if (clubPageShot && clubPageShot.data) {
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/club_page_reordered.png', Buffer.from(clubPageShot.data, 'base64'));
          console.log("Saved club_page_reordered.png");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
