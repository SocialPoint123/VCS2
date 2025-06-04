# คู่มือการ Deploy BergDotBet B.B Admin Panel

## เตรียมการก่อน Deploy

### 1. GitHub Repository Setup

```bash
# สร้าง Git repository ใหม่
git init
git add .
git commit -m "Initial commit: BergDotBet B.B Admin Panel"

# เชื่อมต่อกับ GitHub repository
git remote add origin https://github.com/your-username/bergdotbet-admin.git
git branch -M main
git push -u origin main
```

### 2. Environment Variables สำหรับ Vercel

คุณจะต้องตั้งค่า Environment Variables ต่อไปนี้ใน Vercel Dashboard:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL/Supabase connection string |
| `NODE_ENV` | `production` | Environment mode |

## การ Deploy บน Vercel

### วิธีที่ 1: Deploy ผ่าน Vercel Dashboard

1. เข้าไปที่ [vercel.com](https://vercel.com)
2. เชื่อมต่อ GitHub account
3. Import repository `bergdotbet-admin`
4. ตั้งค่า Environment Variables:
   - `DATABASE_URL`: ใส่ connection string ของฐานข้อมูล
5. กด Deploy

### วิธีที่ 2: Deploy ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login เข้า Vercel
vercel login

# Deploy project
vercel --prod
```

## การตั้งค่าฐานข้อมูล

### Supabase Setup (แนะนำ)

1. สร้าง project ใหม่ที่ [supabase.com](https://supabase.com)
2. ไปที่ Settings > Database
3. คัดลอก Connection String
4. เพิ่ม Environment Variable `DATABASE_URL` ใน Vercel

### PostgreSQL Setup

หากใช้ PostgreSQL server ของคุณเอง:

```bash
# ตัวอย่าง DATABASE_URL
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

## การตรวจสอบหลัง Deploy

### 1. ตรวจสอบ Build Logs

- เข้าไปที่ Vercel Dashboard
- ดู Build logs สำหรับ errors
- ตรวจสอบ Function logs

### 2. ทดสอบ API Endpoints

```bash
# ทดสอบ health check
curl https://your-app.vercel.app/api/health

# ทดสอบ authentication
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. ตรวจสอบการเชื่อมต่อฐานข้อมูล

- เข้าไปที่ admin panel
- ทดสอบ login
- ตรวจสอบ dashboard stats

## Troubleshooting

### Build Errors

```bash
# หาก build ล้มเหลว ลองรันใน local
npm run build

# ตรวจสอบ TypeScript errors
npm run check
```

### Database Connection Errors

1. ตรวจสอบ `DATABASE_URL` format
2. ตรวจสอบ network access ของฐานข้อมูล
3. รัน migrations:
```bash
npm run db:push
```

### Function Timeout

หาก API functions timeout:
1. เพิ่ม `maxDuration` ใน `vercel.json`
2. ปรับปรุง database queries ให้เร็วขึ้น

## Performance Optimization

### 1. Database Optimization

- เพิ่ม indexes สำหรับ queries ที่ใช้บ่อย
- ใช้ connection pooling
- Cache ข้อมูลที่ไม่เปลี่ยนแปลงบ่อย

### 2. Frontend Optimization

- Lazy loading สำหรับ components ขนาดใหญ่
- Image optimization
- Code splitting

## Security Checklist

- [ ] ตั้งค่า Environment Variables อย่างปลอดภัย
- [ ] ใช้ HTTPS สำหรับ production
- [ ] ตรวจสอบ CORS settings
- [ ] ใช้ rate limiting สำหรับ API
- [ ] Validate inputs อย่างเข้มงวด

## Monitoring

### 1. Vercel Analytics

เปิดใช้งาน Vercel Analytics เพื่อติดตาม:
- Page views
- Performance metrics
- Error rates

### 2. Database Monitoring

ตั้งค่า monitoring สำหรับ:
- Connection count
- Query performance
- Storage usage

## การอัพเดท

### Deploy Updates

```bash
# Update code และ push
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel จะ auto-deploy
```

### Database Migrations

```bash
# รัน migrations หลัง deploy
npm run db:push
```

## Support

หากพบปัญหา:
1. ตรวจสอบ Vercel Function Logs
2. ตรวจสอบ Database Connection
3. ดู Browser Console สำหรับ frontend errors
4. ตรวจสอบ Network tab สำหรับ API errors