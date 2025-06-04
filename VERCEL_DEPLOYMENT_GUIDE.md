# คู่มือการ Deploy BergDotBet Admin Panel บน Vercel

## ขั้นตอนการ Deploy

### 1. เตรียมโปรเจค
โปรเจคได้รับการกำหนดค่าสำหรับ Vercel แล้ว:
- `vercel.json` - การกำหนดค่า deployment
- `api/index.ts` - Serverless function entry point
- `build.sh` - Build script

### 2. สร้างบัญชี Vercel
1. ไปยัง [vercel.com](https://vercel.com)
2. สมัครสมาชิกด้วย GitHub account
3. เชื่อมต่อ repository นี้

### 3. การ Deploy
1. **Import Project** ใน Vercel dashboard
2. **ตั้งค่า Environment Variables:**
   ```
   DATABASE_URL=your_supabase_connection_string
   NODE_ENV=production
   ```
3. **Deploy Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 4. การตั้งค่าเพิ่มเติม
- Framework Preset: `Other`
- Node.js Version: `18.x`
- Root Directory: `.` (ไม่ต้องเปลี่ยน)

### 5. ตรวจสอบการทำงาน
หลัง deploy สำเร็จ:
1. ทดสอบ API endpoints ที่ `/api/`
2. ตรวจสอบการเชื่อมต่อฐานข้อมูล
3. ล็อกอินด้วย admin account

## การเข้าใช้งาน
- **Admin:** `admin` / `admin123`
- **Demo User:** `demo` / `demo123`

## ฟีเจอร์หลักของแอปพลิเคชัน
- ระบบจัดการผู้ใช้และแอดมิน (Thai language support)
- ระบบเครดิตและกระเป๋าเงิน
- ระบบโซเชียลมีเดีย (โพสต์, คอมเมนต์, ไลค์)
- ระบบแชทและข้อความ
- ระบบสินเชื่อและ loan requests
- ระบบร้านค้าและไอเทม
- ระบบสัตว์เลี้ยงเสมือน

## การแก้ไขปัญหา
หากเกิดปัญหา:
1. ตรวจสอบ Function Logs ใน Vercel dashboard
2. ตรวจสอบ Environment Variables
3. ตรวจสอบ Supabase connection string
4. ตรวจสอบ API routes ที่ `/api/auth/login`
- ระบบโซเชียลมีเดีย (โพสต์, คอมเมนต์, ไลค์)
- ระบบแชทและข้อความ
- ระบบสินเชื่อและ loan requests
- ระบบร้านค้าและไอเทม
- ระบบสัตว์เลี้ยงเสมือน

## การเข้าใช้งาน
- **URL:** จะได้รับหลังจาก deploy สำเร็จ
- **Admin Login:** username: `admin`, password: `admin123`
- **Demo Account:** username: `demo`, password: `demo123`