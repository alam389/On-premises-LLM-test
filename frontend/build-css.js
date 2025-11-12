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

const css = fs.readFileSync(inputFile, 'utf8');

postcss([plugin()])
  .process(css, { from: inputFile, to: outputFile })
  .then(result => {
    fs.writeFileSync(outputFile, result.css);
    console.log('CSS built successfully');
  })
  .catch(error => {
    console.error('Error building CSS:', error);
    process.exit(1);
  });

