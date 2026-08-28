const http = require('http');

http.get('http://localhost:8443', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('HTML Length:', data.length);
    console.log(data.slice(0, 500));
  });
}).on('error', (err) => {
  console.error('Error fetching site:', err.message);
});
