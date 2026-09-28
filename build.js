const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Ensure clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Files to copy
const filesToCopy = [
  'index.html',
  'treatments.html',
  'doctor.html',
  'contact.html',
  '404.html',
  '_headers',
  '_redirects'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
});

// Directories to copy
const dirsToCopy = ['css', 'js'];

dirsToCopy.forEach(dir => {
  const src = path.join(__dirname, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
});

console.log('✓ Build successful: Static assets compiled into dist/');
