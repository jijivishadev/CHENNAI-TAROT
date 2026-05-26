// scripts/prebuild-image-check.js
// Simple check for next/image usage with alt and width/height/fill
const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

function checkImageUsage(file) {
  const content = fs.readFileSync(file, 'utf8');
  const imageTags = content.match(/<Image[^>]+/g);
  if (imageTags) {
    imageTags.forEach(tag => {
      if (!/alt=/.test(tag) || (!/width=/.test(tag) && !/fill/.test(tag))) {
        console.warn(`Image missing alt or width/fill in: ${file}\n  ${tag}`);
      }
    });
  }
}

const dirs = ['components', 'app'];
dirs.forEach(dir => {
  const abs = path.join(process.cwd(), dir);
  if (fs.existsSync(abs)) {
    scanDir(abs).forEach(checkImageUsage);
  }
});