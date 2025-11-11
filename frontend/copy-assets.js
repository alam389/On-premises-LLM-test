const fs = require('fs');
const path = require('path');

// Copy HTML and CSS files to dist
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      const ext = path.extname(childItemName);
      // Only copy HTML files (CSS is compiled by Tailwind)
      if (ext === '.html' || fs.statSync(path.join(src, childItemName)).isDirectory()) {
        copyRecursive(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      }
    });
  } else {
    const ext = path.extname(src);
    // Only copy HTML files (CSS is compiled by Tailwind)
    if (ext === '.html') {
      fs.copyFileSync(src, dest);
    }
  }
}

// Copy renderer assets
if (fs.existsSync(path.join(srcDir, 'renderer'))) {
  copyRecursive(
    path.join(srcDir, 'renderer'),
    path.join(distDir, 'renderer')
  );
}

console.log('Assets copied to dist/');

