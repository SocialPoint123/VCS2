# 🚀 คู่มือการ Deploy BergDotBet B.B

## การเตรียมพร้อม

### 1. ตั้งค่า Supabase Database

1. สร้างโปรเจค Supabase ใหม่ที่ [supabase.com](https://supabase.com)
2. ไปที่ Settings → Database
3. คัดลอก Connection String (Transaction pooler)
4. แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านฐานข้อมูล

### 2. Environment Variables ที่จำเป็น

```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
SESSION_SECRET=your-secure-random-string-here
NODE_ENV=production
```

## 🌐 Deploy บน Vercel (แนะนำ)

### ขั้นตอนที่ 1: เตรียม Repository

```bash
# Clone หรือ fork repository
git clone https://github.com/your-username/bergdotbet-bb.git
cd bergdotbet-bb

# Push ขึ้น GitHub repository ของคุณ
git remote set-url origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### ขั้นตอนที่ 2: Deploy บน Vercel

1. ไปที่ [vercel.com](https://vercel.com)
2. เชื่อมต่อกับ GitHub account
3. Import repository ของคุณ
4. ตั้งค่า Environment Variables:
   - `DATABASE_URL`: Connection string จาก Supabase
   - `SESSION_SECRET`: สตริงสุ่มสำหรับ session security
   - `NODE_ENV`: `production`

5. Deploy โดยอัตโนมัติ

### ขั้นตอนที่ 3: ตั้งค่าฐานข้อมูล

หลังจาก deploy แล้ว ระบบจะสร้างตารางฐานข้อมูลอัตโนมัติผ่าน `postinstall` script

## 🚂 Deploy บน Railway

### ขั้นตอนที่ 1: สร้างโปรเจค Railway

1. ไปที่ [railway.app](https://railway.app)
2. เชื่อมต่อกับ GitHub
3. สร้างโปรเจคใหม่จาก repository

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables

```env
DATABASE_URL=your_supabase_connection_string
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
PORT=3000
```

### ขั้นตอนที่ 3: Deploy

Railway จะ deploy อัตโนมัติเมื่อมีการ push ใหม่

## 🐳 Deploy ด้วย Docker

### สร้าง Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Build และ Run

```bash
docker build -t bergdotbet-bb .
docker run -p 5000:5000 \
  -e DATABASE_URL="your_database_url" \
  -e SESSION_SECRET="your_session_secret" \
  -e NODE_ENV="production" \
  bergdotbet-bb
```

## ☁️ Deploy บน Digital Ocean

### ขั้นตอนที่ 1: สร้าง Droplet

1. สร้าง Ubuntu 22.04 droplet
2. เชื่อมต่อผ่าน SSH

### ขั้นตอนที่ 2: ติดตั้ง Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### ขั้นตอนที่ 3: Clone และ Setup

```bash
# Clone repository
git clone https://github.com/your-username/bergdotbet-bb.git
cd bergdotbet-bb

# Install dependencies
npm install

# Build application
npm run build

# Create environment file
nano .env
# ใส่ environment variables

# Start with PM2
pm2 start dist/index.js --name "bergdotbet-bb"
pm2 save
pm2 startup
```

### ขั้นตอนที่ 4: ตั้งค่า Nginx

```bash
sudo nano /etc/nginx/sites-available/bergdotbet-bb
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bergdotbet-bb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 การ Monitor และ Maintenance

### ตรวจสอบ Logs

```bash
# Vercel
vercel logs

# Railway
railway logs

# PM2
pm2 logs bergdotbet-bb

# Docker
docker logs container_name
```

### Database Backup

```bash
# Backup Supabase database
pg_dump "postgresql://..." > backup.sql

# Restore
psql "postgresql://..." < backup.sql
```

### Performance Monitoring

- ใช้ Vercel Analytics
- ตั้งค่า Uptime monitoring
- ติดตาม Database performance ใน Supabase Dashboard

## 🚨 Troubleshooting

### ปัญหาที่พบบ่อย

1. **Database Connection Error**
   - ตรวจสอบ DATABASE_URL
   - ตรวจสอบ IP whitelist ใน Supabase

2. **Session Error**
   - ตรวจสอบ SESSION_SECRET
   - ตรวจสอบ cookie settings

3. **Build Error**
   - ตรวจสอบ Node.js version
   - ลบ node_modules และ install ใหม่

4. **Port Already in Use**
   - เปลี่ยน PORT environment variable
   - ปิดกระบวนการที่ใช้ port นั้น

### การแก้ไขปัญหา

```bash
# ตรวจสอบ environment variables
echo $DATABASE_URL
echo $SESSION_SECRET

# ตรวจสอบ database connection
npm run db:studio

# Restart application
pm2 restart bergdotbet-bb
```

## 📈 Scaling

### Horizontal Scaling

- ใช้ Load Balancer
- สร้าง multiple instances
- ใช้ Redis สำหรับ session storage

### Database Scaling

- ใช้ Read Replicas
- Implement caching (Redis)
- Database indexing optimization

### CDN และ Static Assets

- ใช้ Vercel CDN
- CloudFlare
- AWS CloudFront

---

**หมายเหตุ**: อย่าลืมตั้งค่า SSL certificate สำหรับ production และอัปเดต CORS settings ตามโดเมนจริง