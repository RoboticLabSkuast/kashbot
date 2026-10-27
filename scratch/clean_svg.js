// scratch/clean_svg.js
const fs = require('fs');
const path = require('path');

const publicLogoPath = path.join(__dirname, '..', 'public', 'logo.svg');
let rawSvg = fs.readFileSync(publicLogoPath, 'utf8');

// Strip sodipodi and inkscape tags & attributes
let cleanContent = rawSvg
  .replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/gi, '')
  .replace(/<defs[\s\S]*?<\/defs>/gi, '')
  .replace(/\s*(inkscape|sodipodi):[a-z0-9_-]+="[^"]*"/gi, '');

// Extract paths and circles inside layer1
const layer1Match = cleanContent.match(/<g[^>]*id="layer1"[^>]*>([\s\S]*?)<\/g>\s*<\/svg>/i);
if (!layer1Match) {
  console.error("Failed to match layer1 in cleanContent");
  process.exit(1);
}

const paths = layer1Match[1].trim();

// 1. Full logo with tight viewBox="45 138 125 92"
const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 138 125 92" width="100%" height="100%">
  <g id="kashbot-official-logo">
${paths}
  </g>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'logo.svg'), fullSvg, 'utf8');
console.log("Wrote clean assets/logo.svg");

// 2. Emblem mark with viewBox="64 138 75 60"
const emblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 138 75 60" width="100%" height="100%">
  <g id="kashbot-emblem">
${paths}
  </g>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'assets', 'logo-mark.svg'), emblemSvg, 'utf8');
console.log("Wrote clean assets/logo-mark.svg");
