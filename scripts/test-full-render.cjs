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
        await send('Network.enable');

        // Reload the page and wait
        await send('Page.reload');
        console.log("Waiting 6 seconds for full asset loads...");
        await new Promise(r => setTimeout(r, 6000));

        const evalRes = await send('Runtime.evaluate', { expression: 'document.getElementById("root").innerHTML' });
        console.log("Root length:", evalRes?.result?.value?.length);

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        if (shot && shot.data) {
          const buf = Buffer.from(shot.data, 'base64');
          fs.writeFileSync('w:/sitestrike1/preview_check.png', buf);
          console.log("Saved preview_check.png (" + (buf.length/1024).toFixed(1) + " KB)");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
