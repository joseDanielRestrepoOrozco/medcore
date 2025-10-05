const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const forbidden = [ /\bany\b/g, /z\.string\(\)\.email\(/g ];
let fail = false;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|js)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      forbidden.forEach((re) => {
        if (re.test(content)) {
          console.error(`Forbidden pattern ${re} found in ${full}`);
          fail = true;
        }
      });
    }
  }
}

walk(root);
if (fail) {
  console.error('\nType verification failed. Remove occurrences of `any` and `z.string().email()` in src/');
  process.exit(2);
}
console.log('Type verification passed: no forbidden patterns found');
