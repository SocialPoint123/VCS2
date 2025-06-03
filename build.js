import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 กำลังสร้าง BergDotBet B.B สำหรับ production...');

// ขั้นตอนที่ 1: ลบไฟล์ build เก่า
console.log('📦 ลบไฟล์ build เก่า...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
if (fs.existsSync('client/dist')) {
  fs.rmSync('client/dist', { recursive: true });
}

// ขั้นตอนที่ 2: Build client application
console.log('🎨 สร้าง client application...');
try {
  execSync('vite build', { stdio: 'inherit' });
  console.log('✅ Client build เสร็จสิ้น');
} catch (error) {
  console.error('❌ Client build ล้มเหลว:', error.message);
  process.exit(1);
}

// ขั้นตอนที่ 3: ตรวจสอบ TypeScript
console.log('🔍 ตรวจสอบ TypeScript...');
try {
  execSync('tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Type check ผ่าน');
} catch (error) {
  console.warn('⚠️ มีคำเตือน TypeScript (ดำเนินการ build ต่อ)');
}

// ขั้นตอนที่ 4: Build server สำหรับ production
console.log('⚙️ สร้าง server application...');
try {
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:postgres --external:bcrypt --external:drizzle-orm --external:drizzle-zod', { stdio: 'inherit' });
  console.log('✅ Server build เสร็จสิ้น');
} catch (error) {
  console.error('❌ Server build ล้มเหลว:', error.message);
  process.exit(1);
}

// ขั้นตอนที่ 5: คัดลอกไฟล์ที่จำเป็น
console.log('📋 คัดลอกไฟล์การกำหนดค่า...');
const filesToCopy = [
  'package.json',
  'vercel.json',
  'drizzle.config.ts'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`📄 คัดลอก ${file} แล้ว`);
  }
});

console.log('🎉 Build เสร็จสิ้นเรียบร้อย!');
console.log('📁 ไฟล์ Client: client/dist/');
console.log('📁 ไฟล์ Server: dist/');
console.log('');
console.log('ขั้นตอนต่อไป:');
console.log('1. อัปโหลดโค้ดไปยัง GitHub repository');
console.log('2. เชื่อมต่อ repository กับ Vercel');
console.log('3. ตั้งค่า environment variables ใน Vercel dashboard');
console.log('4. Deploy ไปยัง production');