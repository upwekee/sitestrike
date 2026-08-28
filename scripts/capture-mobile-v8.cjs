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
    '--window-size=412,915',
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
          width: 412,
          height: 915,
          deviceScaleFactor: 2,
          mobile: true
        });

        await send('Page.reload');
        console.log("Waiting 3s for render...");
        await new Promise(r => setTimeout(r, 3000));

        // 1. Scroll to pricing
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView();
            })()
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const priceShot = await send('Page.captureScreenshot', { format: 'png' });
        if (priceShot && priceShot.data) {
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/mobile_v8_pricing.png', Buffer.from(priceShot.data, 'base64'));
          console.log("Saved mobile_v8_pricing.png");
        }

        // 2. Click booking button in pricing
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const btn = Array.from(document.querySelectorAll('#pricing button')).find(b => b.textContent.includes('Забронировать'));
              if (btn) btn.click();
            })()
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const modalShot = await send('Page.captureScreenshot', { format: 'png' });
        if (modalShot && modalShot.data) {
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/mobile_v8_modal_open.png', Buffer.from(modalShot.data, 'base64'));
          console.log("Saved mobile_v8_modal_open.png");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
