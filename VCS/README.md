# BergDotBet B.B Admin Panel

ระบบจัดการแอดมินที่ครบครันสำหรับ BergDotBet B.B พร้อมฟีเจอร์การจัดการผู้ใช้ ระบบกระเป๋าเงิน โซเชียลมีเดีย และระบบจัดการร้านค้า

## คุณสมบัติหลัก

- 🔐 ระบบ Authentication และ Authorization
- 👥 จัดการผู้ใช้และสิทธิ์การเข้าถึง
- 💰 ระบบกระเป๋าเงินและธุรกรรมเครดิต
- 📱 โซเชียลมีเดียและระบบแชท
- 🛒 ระบบจัดการร้านค้าและไอเทม
- 🐾 ระบบสัตว์เลี้ยงเสมือน
- 📊 แดชบอร์ดแอดมินและสถิติ

## เทคโนโลยีที่ใช้

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL/Supabase with Drizzle ORM
- **Authentication**: Session-based authentication
- **State Management**: TanStack Query (React Query)
- **Form Management**: React Hook Form with Zod validation
- **Routing**: Wouter
- **Deployment**: Vercel

## การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- PostgreSQL หรือ Supabase database
- npm หรือ yarn

### การติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd bergdotbet-admin
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. ตั้งค่า environment variables:
```bash
cp .env.example .env
```

4. แก้ไขไฟล์ `.env` และเพิ่มข้อมูลการเชื่อมต่อฐานข้อมูล:
```
DATABASE_URL=your_postgresql_connection_string
```

5. รัน database migrations:
```bash
npm run db:push
```

6. เริ่มต้น development server:
```bash
npm run dev
```

### การ Build สำหรับ Production

```bash
npm run build
npm start
```

## โครงสร้างโปรเจค

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── migrations/          # Database migrations
```

## การ Deploy บน Vercel

1. เชื่อมต่อ GitHub repository กับ Vercel
2. ตั้งค่า Environment Variables ใน Vercel Dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
3. Deploy จะทำงานอัตโนมัติเมื่อ push ไปยัง main branch

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL/Supabase connection string |
| `NODE_ENV` | Environment (development/production) |

## API Endpoints

### Authentication
- `POST /api/login` - เข้าสู่ระบบ
- `POST /api/register` - สมัครสมาชิก
- `POST /api/logout` - ออกจากระบบ

### Admin Management
- `GET /api/admin/stats` - สถิติแดชบอร์ด
- `GET /api/admin/users` - รายชื่อผู้ใช้ทั้งหมด
- `PUT /api/admin/users/:id/status` - อัพเดทสถานะผู้ใช้

### User Management
- `GET /api/profile` - ข้อมูลโปรไฟล์
- `GET /api/wallet` - ข้อมูลกระเป๋าเงิน
- `POST /api/wallet/transfer` - โอนเครดิต

## การพัฒนา

### Code Style
- ใช้ TypeScript สำหรับ type safety
- ใช้ ESLint และ Prettier สำหรับ code formatting
- ใช้ Conventional Commits สำหรับ commit messages

### Database
- ใช้ Drizzle ORM สำหรับ database operations
- Database schema อยู่ใน `shared/schema.ts`
- Migration files อยู่ใน `migrations/`

## การสนับสนุน

หากพบปัญหาการใช้งาน กรุณาติดต่อทีมพัฒนา

## License

MIT License