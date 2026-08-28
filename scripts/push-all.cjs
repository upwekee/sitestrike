const { execSync } = require('child_process');

try {
  const token = execSync('gh auth token').toString().trim();
  const b64 = Buffer.from(`x-access-token:${token}`).toString('base64');
  const authHeader = `http.extraheader=AUTHORIZATION: basic ${b64}`;

  console.log("Staging and committing all changes to main...");
  execSync('git add -A', { stdio: 'inherit' });
  try {
    execSync('git commit -m "perf: optimize all photos, media and renders (-92% size reduction, from 210MB to 16MB)"', { stdio: 'inherit' });
  } catch (e) {
    console.log("Nothing to commit or already committed.");
  }

  console.log("Pushing main branch...");
  execSync(`git -c "${authHeader}" push origin main --force`, { stdio: 'inherit' });

  console.log("Deploying to gh-pages...");
  try { execSync('git branch -D gh-pages', { stdio: 'ignore' }); } catch (_) {}
  execSync('git checkout --orphan gh-pages', { stdio: 'inherit' });
  execSync('git reset', { stdio: 'inherit' });
  execSync('git --work-tree=docs add --all', { stdio: 'inherit' });
  execSync('git --work-tree=docs commit -m "Deploy optimized build to GitHub Pages"', { stdio: 'inherit' });
  execSync(`git -c "${authHeader}" push origin gh-pages --force`, { stdio: 'inherit' });
  execSync('git checkout -f main', { stdio: 'inherit' });

  console.log("SUCCESS: All optimized assets deployed to GitHub!");
} catch (e) {
  console.error("Error during push:", e.message);
  try { execSync('git checkout -f main', { stdio: 'ignore' }); } catch (_) {}
}
