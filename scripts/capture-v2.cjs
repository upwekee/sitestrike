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
        console.log("Waiting 3.5s for render...");
        await new Promise(r => setTimeout(r, 3500));

        // Desktop Hero + Clubs Viewport
        const shotDesktop = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 1600, height: 1200, scale: 1 }
        });
        if (shotDesktop && shotDesktop.data) {
          const buf = Buffer.from(shotDesktop.data, 'base64');
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/desktop_v2_live.png', buf);
          console.log("Saved desktop_v2_live.png (" + (buf.length / 1024).toFixed(1) + " KB)");
        }

        // Desktop Food & SmartGamer Section
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1400)' });
        await new Promise(r => setTimeout(r, 1000));
        const shotFood = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 1600, height: 1100, scale: 1 }
        });
        if (shotFood && shotFood.data) {
          const buf = Buffer.from(shotFood.data, 'base64');
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/food_v2_live.png', buf);
          console.log("Saved food_v2_live.png (" + (buf.length / 1024).toFixed(1) + " KB)");
        }

        // Mobile Viewport (iPhone 14 Pro size: 393 x 852)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 393,
          height: 852,
          deviceScaleFactor: 2,
          mobile: true
        });
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
        await new Promise(r => setTimeout(r, 1000));
        const shotMobile = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: 393, height: 852, scale: 2 }
        });
        if (shotMobile && shotMobile.data) {
          const buf = Buffer.from(shotMobile.data, 'base64');
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/mobile_v2_live.png', buf);
          console.log("Saved mobile_v2_live.png (" + (buf.length / 1024).toFixed(1) + " KB)");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
