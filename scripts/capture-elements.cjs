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
    '--window-size=1680,1200',
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
        await send('DOM.enable');

        await new Promise(r => setTimeout(r, 2500));

        // Get bounding box of #clubs
        const doc = await send('DOM.getDocument');
        const nodeClubs = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '#clubs' });
        const boxClubs = await send('DOM.getBoxModel', { nodeId: nodeClubs.nodeId });

        console.log("Clubs box model:", boxClubs.model.content);
        const x = boxClubs.model.content[0];
        const y = boxClubs.model.content[1];
        const w = boxClubs.model.content[2] - x;
        const h = boxClubs.model.content[5] - y;

        const shot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x, y, width: w, height: h, scale: 1 }
        });

        if (shot && shot.data) {
          const buf = Buffer.from(shot.data, 'base64');
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/clubs_element.png', buf);
          console.log("Saved clubs_element.png (" + (buf.length/1024).toFixed(1) + " KB)");
        }

        // Get bounding box of #zones
        const nodeZones = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '#zones' });
        const boxZones = await send('DOM.getBoxModel', { nodeId: nodeZones.nodeId });
        const zx = boxZones.model.content[0];
        const zy = boxZones.model.content[1];
        const zw = boxZones.model.content[2] - zx;
        const zh = boxZones.model.content[5] - zy;

        const shotZones = await send('Page.captureScreenshot', {
          format: 'png',
          clip: { x: zx, y: zy, width: zw, height: zh, scale: 1 }
        });

        if (shotZones && shotZones.data) {
          const buf = Buffer.from(shotZones.data, 'base64');
          fs.writeFileSync('C:/Users/admin/.gemini/antigravity/brain/23f01a5d-861a-4e45-94bc-9090a5b438cf/zones_element.png', buf);
          console.log("Saved zones_element.png (" + (buf.length/1024).toFixed(1) + " KB)");
        }

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
