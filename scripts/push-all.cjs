const { execSync } = require('child_process');

try {
  console.log("Building production bundle...");
  execSync('npm run build', { stdio: 'inherit' });

  // Update docs folder
  const fs = require('fs');
  if (fs.existsSync('docs')) {
    fs.rmSync('docs', { recursive: true, force: true });
  }
  fs.cpSync('dist', 'docs', { recursive: true });
  fs.writeFileSync('docs/.nojekyll', '');

  console.log("Committing changes...");
  execSync('git add -A', { stdio: 'inherit' });
  try {
    execSync('git commit -m "Fix asset relative paths for GitHub Pages and all hosting"', { stdio: 'inherit' });
  } catch (e) {
    console.log("Nothing new to commit or already committed");
  }

  const token = execSync('gh auth token').toString().trim();
  const b64 = Buffer.from(`x-access-token:${token}`).toString('base64');

  console.log("Pushing to main...");
  execSync(`git -c "http.extraheader=AUTHORIZATION: basic ${b64}" push origin main`, { stdio: 'inherit' });

  console.log("Deploying to gh-pages...");
  execSync('git branch -D gh-pages', { stdio: 'ignore' });
  execSync('git checkout --orphan gh-pages', { stdio: 'inherit' });
  execSync('git reset', { stdio: 'inherit' });
  execSync('git --work-tree=dist add --all', { stdio: 'inherit' });
  execSync('git --work-tree=dist commit -m "Deploy latest build to gh-pages"', { stdio: 'inherit' });
  execSync(`git -c "http.extraheader=AUTHORIZATION: basic ${b64}" push origin gh-pages --force`, { stdio: 'inherit' });
  execSync('git checkout -f main', { stdio: 'inherit' });

  console.log("All branches successfully pushed!");
} catch (e) {
  console.error("Failed:", e.message);
  try { execSync('git checkout -f main', { stdio: 'ignore' }); } catch (_) {}
}
