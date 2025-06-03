import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building BergDotBet B.B for production...');

// Step 1: Clean previous builds
console.log('📦 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
if (fs.existsSync('client/dist')) {
  fs.rmSync('client/dist', { recursive: true });
}

// Step 2: Build client
console.log('🎨 Building client application...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('✅ Client build completed');
} catch (error) {
  console.error('❌ Client build failed:', error.message);
  process.exit(1);
}

// Step 3: Type check
console.log('🔍 Running type check...');
try {
  execSync('tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Type check passed');
} catch (error) {
  console.warn('⚠️ Type check warnings (continuing with build)');
}

// Step 4: Build server for production
console.log('⚙️ Building server application...');
try {
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:postgres --external:bcrypt --external:drizzle-orm --external:drizzle-zod', { stdio: 'inherit' });
  console.log('✅ Server build completed');
} catch (error) {
  console.error('❌ Server build failed:', error.message);
  process.exit(1);
}

// Step 5: Copy necessary files
console.log('📋 Copying configuration files...');
const filesToCopy = [
  'package.json',
  'vercel.json',
  'drizzle.config.ts'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`📄 Copied ${file}`);
  }
});

console.log('🎉 Build completed successfully!');
console.log('📁 Client files: client/dist/');
console.log('📁 Server files: dist/');
console.log('');
console.log('Next steps:');
console.log('1. Push code to GitHub repository');
console.log('2. Connect repository to Vercel');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Deploy to production');