// scratch/prepare_logos.js
const fs = require('fs');
const path = require('path');

const publicLogoPath = path.join(__dirname, '..', 'public', 'logo.svg');
const rawSvg = fs.readFileSync(publicLogoPath, 'utf8');

// Extract the content inside <g ... id="layer1"> ... </g>
const layer1Match = rawSvg.match(/<g[\s\S]*?id="layer1"[\s\S]*?>([\s\S]*?)<\/g>\s*<\/svg>/);
if (!layer1Match) {
  console.error("Could not extract layer1");
  process.exit(1);
}

const innerContent = layer1Match[1];

// 1. Full logo with tight viewBox="45 138 125 92"
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 138 125 92" width="100%" height="100%" xml:space="preserve">
  <g id="kashbot-official-logo">
${innerContent}
  </g>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'logo.svg'), fullLogoSvg, 'utf8');
console.log("Wrote assets/logo.svg successfully.");

// 2. Emblem mark with viewBox="64 138 75 60"
// Emblem contains botanical paths (path41, path40, path38, path36, path35, path60, path32, path24 and circles)
const emblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 138 75 60" width="100%" height="100%" xml:space="preserve">
  <g id="kashbot-emblem">
${innerContent}
  </g>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'logo-mark.svg'), emblemSvg, 'utf8');
console.log("Wrote assets/logo-mark.svg successfully.");
