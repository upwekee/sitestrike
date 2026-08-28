const { execSync } = require('child_process');

try {
  const token = execSync('gh auth token').toString().trim();
  const b64 = Buffer.from(`x-access-token:${token}`).toString('base64');
  const authHeader = `http.extraheader=AUTHORIZATION: basic ${b64}`;

  console.log("Pushing main branch...");
  execSync(`git -c "${authHeader}" push origin main`, { stdio: 'inherit' });

  console.log("SUCCESS: main pushed to GitHub!");
} catch (e) {
  console.error("Error:", e.message);
}
