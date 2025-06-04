# คู่มือการ Deploy BergDotBet Admin Panel ไปยัง Vercel

## ขั้นตอนการ Deploy

### 1. เตรียมโปรเจค
- โปรเจคได้รับการปรับแต่งให้พร้อม deploy บน Vercel แล้ว
- ไฟล์ `vercel.json` ได้รับการกำหนดค่าถูกต้อง
- การจัดการ environment variables พร้อมใช้งาน

### 2. สร้างบัญชี Vercel
1. ไปยัง [vercel.com](https://vercel.com)
2. สมัครสมาชิกด้วย GitHub account
3. เชื่อมต่อ repository นี้

### 3. ตั้งค่า Environment Variables
ในหน้า Vercel Project Settings > Environment Variables เพิ่ม:

```
DATABASE_URL=your_supabase_connection_string
NODE_ENV=production
```

### 4. Deploy
1. Push โค้ดไปยัง GitHub repository
2. Vercel จะ auto-deploy ทันที
3. หรือใช้ Vercel CLI: `vercel --prod`

### 5. ตรวจสอบการทำงาน
- ตรวจสอบ build logs
- ทดสอบ API endpoints
- ตรวจสอบการเชื่อมต่อฐานข้อมูล

## ข้อมูลสำคัญ
- แอปพลิเคชันใช้ Supabase PostgreSQL database
- ระบบ authentication แบบ session-based
- รองรับ Thai language ทั้งหมด
- มีระบบจัดการผู้ใช้และเครดิตครบถ้วน

## การแก้ไขปัญหา
หากเกิดปัญหาการ deploy:
1. ตรวจสอบ environment variables
2. ตรวจสอบ Supabase connection
3. ดู build logs ใน Vercel dashboard