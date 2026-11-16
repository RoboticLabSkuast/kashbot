// .superpowers/sdd/review-package.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const [,, base, head, customOut] = process.argv;
if (!base || !head) {
  console.error("Usage: node review-package.js BASE HEAD [OUTFILE]");
  process.exit(1);
}

const baseShort = execSync(`git rev-parse --short ${base}`, { encoding: 'utf8' }).trim();
const headShort = execSync(`git rev-parse --short ${head}`, { encoding: 'utf8' }).trim();
const outPath = customOut || path.join(__dirname, `review-${baseShort}..${headShort}.diff`);

const log = execSync(`git log --oneline ${base}..${head}`, { encoding: 'utf8' });
const stat = execSync(`git diff --stat ${base}..${head}`, { encoding: 'utf8' });
const diff = execSync(`git diff -U10 ${base}..${head}`, { encoding: 'utf8' });

const content = [
  `# Review package: ${base}..${head}`,
  '',
  '## Commits',
  log,
  '## Files changed',
  stat,
  '## Diff',
  diff
].join('\n');

fs.writeFileSync(outPath, content, 'utf8');
const count = execSync(`git rev-list --count ${base}..${head}`, { encoding: 'utf8' }).trim();
console.log(`wrote ${outPath}: ${count} commit(s), ${content.length} bytes`);
