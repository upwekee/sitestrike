const { spawn } = require('child_process');
const http = require('http');

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

        const evalRes = await send('Runtime.evaluate', {
          expression: `
            (async () => {
              try {
                const mod = await import('/src/App.tsx');
                console.log('App module keys:', Object.keys(mod));
                const React = await import('react');
                const ReactDOM = await import('react-dom/client');
                const App = mod.default;
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(App));
                return 'RENDER CALLED DIRECTLY';
              } catch (e) {
                return 'CATCH ERROR: ' + e.message + '\\n' + e.stack;
              }
            })()
          `,
          awaitPromise: true,
          returnByValue: true
        });

        console.log("DIRECT RENDER RESULT:", evalRes);

        await new Promise(r => setTimeout(r, 1500));
        const checkRoot = await send('Runtime.evaluate', {
          expression: 'document.getElementById("root").innerHTML.length'
        });
        console.log("ROOT LENGTH AFTER DIRECT RENDER:", checkRoot?.result?.value);

        ws.close();
        browserProc.kill();
      };
    });
  });
}

main();
