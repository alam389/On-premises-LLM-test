const chokidar = require('chokidar');
const postcss = require('postcss');
const plugin = require('@tailwindcss/postcss');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'src/renderer/styles/main.css');
const outputFile = path.join(__dirname, 'dist/renderer/styles/main.css');

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const processCSS = () => {
  const css = fs.readFileSync(inputFile, 'utf8');
  postcss([plugin()])
    .process(css, { from: inputFile, to: outputFile })
    .then(result => {
      fs.writeFileSync(outputFile, result.css);
      console.log('CSS rebuilt');
    })
    .catch(error => {
      console.error('Error building CSS:', error);
    });
};

// Initial build
processCSS();

// Watch for changes
chokidar.watch(inputFile).on('change', () => {
  console.log('CSS file changed, rebuilding...');
  processCSS();
});

console.log('Watching CSS files...');

