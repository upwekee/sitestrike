const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const browserPath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const port = 9222;

  const browserProc = spawn(browserPath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get(`http://127.0.0.1:${port}/json`, async (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const pages = JSON.parse(raw);
      const targetPage = pages[0];
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
        ws.onmessage = (event) => {
          try {
            const msg = typeof event.data === 'string' ? JSON.parse(event.data) : JSON.parse(event.data.toString());
            if (msg.method === 'Runtime.consoleAPICalled') {
              console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
            }
            if (msg.method === 'Runtime.exceptionThrown') {
              console.error('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails));
            }
            if (msg.method === 'Log.entryAdded') {
              console.log('LOG ENTRY:', msg.params.entry);
            }
          } catch(e) {}
        };

        await send('Runtime.enable');
        await send('Log.enable');
        await send('Page.enable');
        await send('Network.enable');

        console.log("Navigating to http://localhost:8443 ...");
        await send('Page.navigate', { url: 'http://localhost:8443' });

        await new Promise(r => setTimeout(r, 4000));

        const resRoot = await send('Runtime.evaluate', { expression: 'document.getElementById("root") ? document.getElementById("root").innerHTML.length : 0' });
        console.log("Root innerHTML length after navigation:", resRoot?.result?.value);

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
