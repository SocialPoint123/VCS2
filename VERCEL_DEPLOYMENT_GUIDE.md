# คู่มือการ Deploy BergDotBet Admin Panel

## การ Deploy บน Replit

### 1. ใช้ Replit Deployments
แอปพลิเคชันของคุณพร้อม deploy แล้ว:

1. **คลิกปุ่ม "Deploy"** ในแท็บ Deployments ของ Replit
2. **เลือก "Autoscale"** เป็นประเภทการ deploy
3. **ตั้งค่า Environment Variables:**
   - `DATABASE_URL` = connection string ของ Supabase ที่คุณใช้อยู่
   - `NODE_ENV` = production

### 2. ตรวจสอบการทำงาน
- แอปพลิเคชันจะมี URL แบบ `.replit.app`
- ทดสอบการเข้าสู่ระบบแอดมิน
- ตรวจสอบการเชื่อมต่อฐานข้อมูล

### 3. การ Deploy ไปยัง External Platform (เช่น Vercel)

หากต้องการ deploy ไปที่อื่น:

1. **เตรียม Environment Variables:**
   ```
   DATABASE_URL=your_supabase_connection_string
   NODE_ENV=production
   ```

2. **ไฟล์สำคัญที่เตรียมไว้:**
   - `vercel.json` - สำหรับ Vercel deployment
   - `api/index.ts` - Entry point สำหรับ serverless

3. **Build Command:** `npm run build`
4. **Start Command:** `npm run start`

## ฟีเจอร์หลักของแอปพลิเคชัน
- ระบบจัดการผู้ใช้และแอดมิน (Thai language support)
- ระบบเครดิตและกระเป๋าเงิน
- ระบบโซเชียลมีเดีย (โพสต์, คอมเมนต์, ไลค์)
- ระบบแชทและข้อความ
- ระบบสินเชื่อและ loan requests
- ระบบร้านค้าและไอเทม
- ระบบสัตว์เลี้ยงเสมือน

## การเข้าใช้งาน
- **URL:** จะได้รับหลังจาก deploy สำเร็จ
- **Admin Login:** username: `admin`, password: `admin123`
- **Demo Account:** username: `demo`, password: `demo123`