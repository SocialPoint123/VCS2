# BergDotBet B.B - Complete Social Platform

เว็บไซต์โซเชียลมีเดียที่มีระบบครบครัน พร้อม Admin Panel, ระบบเครดิต, สินเชื่อ, ร้านค้า และสัตว์เลี้ยง

## 🚀 ฟีเจอร์หลัก

### 📊 ระบบ Admin Panel
- Dashboard พร้อมสถิติแบบ Real-time
- จัดการผู้ใช้และสถานะ
- ตรวจสอบประวัติล็อกอิน
- จัดการธุรกรรมเครดิต
- ระบบอนุมัติคำขอสินเชื่อ

### 📱 ระบบ Social Media Feed
- โพสต์ข้อความ รูปภาพ วิดีโอ และลิงก์
- ระบบไลค์/ดิสไลค์
- ระบบคอมเมนต์แบบ Real-time
- การแชร์และแสดงผลอัตโนมัติ

### 💬 ระบบแชท
- แชทสาธารณะ (Public Chat)
- แชทส่วนตัว (Private Chat)
- WebSocket สำหรับการส่งข้อความแบบ Real-time
- การแจ้งเตือนข้อความใหม่

### 💰 ระบบสินเชื่อ
- คำขอสินเชื่อออนไลน์
- การคำนวณดอกเบี้ยรายชั่วโมง
- ตรวจสอบสิทธิ์การขอสินเชื่อ
- ระบบอนุมัติ/ปฏิเสธคำขอ

### 👤 ระบบโปรไฟล์ผู้ใช้
- ProfileCard แสดงข้อมูลผู้ใช้
- ProfilePostsList แสดงโพสต์ของผู้ใช้
- ระบบโอนเครดิตระหว่างผู้ใช้
- ประวัติการทำธุรกรรม

### 💳 ระบบกระเป๋าเงิน
- WalletBalance แสดงยอดเครดิต
- CreditHistory ประวัติธุรกรรมทั้งหมด
- TransferForm สำหรับโอนเครดิต
- ระบบเติมเงิน/ถอนเงิน

### 🛒 ระบบร้านค้า
- ไอเทมหลากหลายประเภท
- ระบบความหายาก (ธรรมดา, หายาก, เอปิก, ตำนาน)
- การซื้อด้วยเครดิต
- ตรวจสอบไอเทมที่เป็นเจ้าของ

### 🐾 ระบบสัตว์เลี้ยง
- เลี้ยงสัตว์เลี้ยง 6 ประเภท (แมว หมา กระต่าย นก แฮมสเตอร์ ปลา)
- ให้อาหารเพื่อเพิ่มพลังงาน (ทุก 2 ชั่วโมง)
- เล่นเพื่อเพิ่มอารมณ์และประสบการณ์ (ทุก 2 ชั่วโมง)
- เก็บเกี่ยวเครดิตตามสถานะ (ทุก 4 ชั่วโมง)
- ระบบเลเวลและประสบการณ์

## 🛠 เทคโนโลยีที่ใช้

### Frontend
- **React** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **React Query (TanStack Query)** - Data Fetching
- **Wouter** - Routing
- **React Hook Form** - Form Management
- **Zod** - Schema Validation

### Backend
- **Express.js** - Web Framework
- **TypeScript** - Type Safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database (Supabase)
- **WebSocket (ws)** - Real-time Communication
- **Passport.js** - Authentication
- **Express Session** - Session Management

### Database
- **Supabase** - PostgreSQL Database
- **Drizzle Kit** - Database Migrations

### Development Tools
- **ESBuild** - Fast Bundling
- **PostCSS** - CSS Processing
- **Autoprefixer** - CSS Vendor Prefixes

## 📋 ข้อกำหนดระบบ

- Node.js 18+ 
- PostgreSQL Database (Supabase)
- Modern Web Browser with WebSocket support

## 🚀 การติดตั้งและใช้งาน

### 1. Clone Repository
```bash
git clone https://github.com/your-username/bergdotbet-bb.git
cd bergdotbet-bb
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ root:
```env
DATABASE_URL=your_supabase_connection_string
SESSION_SECRET=your_random_session_secret
NODE_ENV=development
```

### 4. การตั้งค่า Supabase Database

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. สร้างโปรเจคใหม่
3. ไปที่หน้า Project Settings → Database
4. คัดลอก Connection String (Transaction pooler)
5. แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านฐานข้อมูล

### 5. Run Database Migrations
```bash
npm run db:generate
npm run db:migrate
```

### 6. เริ่มต้น Development Server
```bash
npm run dev
```

เว็บไซต์จะเปิดที่ `http://localhost:5000`

## 📁 โครงสร้างโปรเจค

```
bergdotbet-bb/
├── client/src/
│   ├── components/          # React Components
│   ├── pages/              # Page Components
│   ├── modules/            # Feature Modules
│   ├── hooks/              # Custom Hooks
│   └── lib/                # Utilities
├── server/
│   ├── index.ts            # Express Server
│   ├── routes.ts           # API Routes
│   ├── storage.ts          # Database Layer
│   └── vite.ts             # Vite Integration
├── shared/
│   └── schema.ts           # Database Schema
├── migrations/             # Database Migrations
└── docs/                   # Documentation
```

## 🔧 คำสั่งที่มีประโยชน์

```bash
# Development
npm run dev                 # เริ่ม development server
npm run build              # Build สำหรับ production
npm run preview            # Preview production build

# Database
npm run db:generate        # Generate migration files
npm run db:migrate         # Run migrations
npm run db:studio          # Open Drizzle Studio

# Type Checking
npm run type-check         # ตรวจสอบ TypeScript
```

## 🚀 การ Deploy

### Vercel (แนะนำ)

1. Push โค้ดขึ้น GitHub
2. เชื่อมต่อ Vercel กับ GitHub Repository
3. ตั้งค่า Environment Variables ใน Vercel:
   - `DATABASE_URL`
   - `SESSION_SECRET`
4. Deploy อัตโนมัติ

### Railway

1. เชื่อมต่อ Railway กับ GitHub
2. ตั้งค่า Environment Variables
3. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ
- `GET /api/admin/auth` - ตรวจสอบสถานะล็อกอิน

### Admin
- `GET /api/admin/dashboard-stats` - สถิติ Dashboard
- `GET /api/admin/users` - รายชื่อผู้ใช้
- `PUT /api/admin/users/:id/status` - อัปเดตสถานะผู้ใช้

### Posts
- `GET /api/posts` - ดึงโพสต์ทั้งหมด
- `POST /api/posts` - สร้างโพสต์ใหม่
- `GET /api/posts/:id` - ดึงโพสต์เดี่ยว
- `DELETE /api/posts/:id` - ลบโพสต์

### Comments
- `GET /api/posts/:postId/comments` - ดึงคอมเมนต์
- `POST /api/posts/:postId/comments` - เพิ่มคอมเมนต์

### Likes
- `POST /api/posts/:postId/like` - ไลค์/ดิสไลค์

### Wallet
- `GET /api/wallet/:userId` - ดึงข้อมูลกระเป๋าเงิน
- `GET /api/wallet/:userId/transactions` - ประวัติธุรกรรม
- `POST /api/wallet/transfer` - โอนเครดิต

### Shop
- `GET /api/shop/items` - ดึงไอเทมร้านค้า
- `POST /api/shop/purchase` - ซื้อไอเทม
- `GET /api/shop/user-items/:userId` - ไอเทมของผู้ใช้

### Pet
- `GET /api/pet/:userId` - ดึงข้อมูลสัตว์เลี้ยง
- `POST /api/pet/create` - สร้างสัตว์เลี้ยงใหม่
- `POST /api/pet/action` - ดำเนินการกับสัตว์เลี้ยง

## 🔒 การรักษาความปลอดภัย

- Session-based Authentication
- Password Hashing (bcrypt)
- SQL Injection Protection (Drizzle ORM)
- XSS Protection
- CSRF Protection
- Environment Variable Security

## 🧪 การทดสอบ

ระบบมีข้อมูลตัวอย่างพร้อมใช้งาน:

### ผู้ใช้ Admin
- Username: `admin`
- Password: `password`

### ผู้ใช้ทั่วไป
- Username: `user1` / Password: `password`
- Username: `user2` / Password: `password`

## 🤝 การมีส่วนร่วม

1. Fork Repository
2. สร้าง Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add amazing feature'`)
4. Push ไปยัง Branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request

## 📄 License

MIT License - ดูไฟล์ LICENSE สำหรับรายละเอียด

## 📞 การติดต่อ

หากมีคำถามหรือปัญหา กรุณาสร้าง Issue ใน GitHub Repository

---

**BergDotBet B.B** - Social Platform ที่ครบครันที่สุด พร้อมระบบการเงินและเกมสัตว์เลี้ยง 🚀