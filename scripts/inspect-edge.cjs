const http = require('http');
const { spawn } = require('child_process');

const edge = spawn("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", [
  "--headless=new",
  "--disable-gpu",
  "--remote-debugging-port=9222",
  "https://upwekee.github.io/sitestrike/"
]);

setTimeout(async () => {
  try {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const pages = JSON.parse(data);
        console.log('Pages:', pages);
        const wsUrl = pages[0]?.webSocketDebuggerUrl;
        console.log('WebSocket URL:', wsUrl);

        if (wsUrl) {
          const WebSocket = require('ws'); // check if available or native
        }
        edge.kill();
      });
    });
  } catch (e) {
    console.error(e);
    edge.kill();
  }
}, 3000);
