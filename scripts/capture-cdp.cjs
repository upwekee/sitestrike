const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
  const browserPath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const port = 9222;

  console.log("Launching headless browser with remote debugging...");
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
      try {
        const pages = JSON.parse(raw);
        console.log("Pages found:", pages.length);
        const targetPage = pages.find(p => p.url.includes('localhost:8443') || p.type === 'page');
        if (!targetPage || !targetPage.webSocketDebuggerUrl) {
          console.error("No target page found");
          browserProc.kill();
          return;
        }

        const wsUrl = targetPage.webSocketDebuggerUrl;
        console.log("Connecting to page via CDP WebSocket...");
        const ws = new WebSocket(wsUrl);

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
          console.log("CDP Connected!");
          await send('Runtime.enable');
          await send('Page.enable');

          // Wait 3 seconds for React rendering and images
          await new Promise(r => setTimeout(r, 3000));

          console.log("Capturing screenshot...");
          const shot = await send('Page.captureScreenshot', { format: 'png' });
          if (shot && shot.data) {
            const buffer = Buffer.from(shot.data, 'base64');
            const dest = 'C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/live_screenshot.png';
            fs.writeFileSync(dest, buffer);
            console.log("Screenshot successfully saved to " + dest + " (" + (buffer.length / 1024).toFixed(1) + " KB)");
          }

          ws.close();
          browserProc.kill();
        };
      } catch (err) {
        console.error("Error in CDP script:", err);
        browserProc.kill();
      }
    });
  }).on('error', (err) => {
    console.error("CDP connection error:", err.message);
    browserProc.kill();
  });
}

main().catch(console.error);
