const { execSync } = require('child_process');

try {
  const token = execSync('gh auth token').toString().trim();
  const b64 = Buffer.from(`x-access-token:${token}`).toString('base64');
  console.log("Pushing gh-pages...");
  execSync(`git -c "http.extraheader=AUTHORIZATION: basic ${b64}" push origin gh-pages --force`, { stdio: 'inherit' });
  console.log("Successfully pushed gh-pages!");
} catch (e) {
  console.error("Error:", e.message);
}
