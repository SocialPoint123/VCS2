# โมดูล Admin Panel - BergDotBet B.B

## คำอธิบายโมดูล

โมดูล Admin Panel เป็นระบบจัดการผู้ดูแลระบบสำหรับเว็บไซต์ BergDotBet B.B โดยให้ผู้ดูแลระบบสามารถตรวจสอบและจัดการข้อมูลผู้ใช้ ประวัติการล็อกอิน และการเคลื่อนไหวเครดิตได้อย่างครบถ้วน ระบบเชื่อมต่อกับฐานข้อมูล Supabase โดยใช้ Drizzle ORM สำหรับการจัดการข้อมูล

## ฟีเจอร์หลัก

### 1. Dashboard แสดงสถิติ
- จำนวนผู้ใช้ทั้งหมดในระบบ
- จำนวนผู้ใช้ออนไลน์ (คำนวณจากสัดส่วน 40% ของผู้ใช้ทั้งหมด)
- เครดิตรวมในระบบจากกระเป๋าเงินทั้งหมด
- จำนวนธุรกรรมในวันนี้

### 2. จัดการผู้ใช้
- แสดงรายชื่อผู้ใช้ทั้งหมดพร้อมรูปโปรไฟล์
- ค้นหาผู้ใช้ตามชื่อจริง, อีเมล, หรือ username
- แสดงข้อมูลเครดิตคงเหลือจากตาราง credit_wallets
- แสดงสถานะผู้ใช้ (ใช้งาน, ระงับชั่วคราว, ถูกแบน)
- ฟังก์ชันอัปเดตสถานะผู้ใช้

### 3. ประวัติการล็อกอิน
- แสดงประวัติการล็อกอินของผู้ใช้แต่ละคนจากตาราง login_logs
- ข้อมูล IP Address, User Agent, Browser Fingerprint
- สถานะการล็อกอิน (สำเร็จ/ล้มเหลว)
- วันที่และเวลาที่ล็อกอิน (เรียงจากใหม่สุด)

### 4. ประวัติการเคลื่อนไหวเครดิต
- แสดงธุรกรรมเครดิตของผู้ใช้จากตาราง credit_transactions
- ประเภทธุรกรรม (ฝากเงิน, ถอนเงิน, ชนะเกม, แพ้เกม, โบนัส, โอนเงิน)
- จำนวนเงิน (แสดงเป็น + หรือ - ตามการรับ/จ่าย)
- ยอดคงเหลือหลังธุรกรรม
- หมายเหตุการทำธุรกรรมเป็นภาษาไทย

## โครงสร้างไฟล์

### Frontend Components
```
client/src/
├── components/admin/
│   ├── AdminLayout.tsx          # เลย์เอาต์หลักของหน้าแอดมิน
│   ├── AdminSidebar.tsx         # แถบเมนูด้านซ้าย
│   ├── DashboardStats.tsx       # การ์ดแสดงสถิติ
│   ├── UserManagementTable.tsx  # ตารางจัดการผู้ใช้
│   ├── LoginLogsModal.tsx       # โมดัลแสดงประวัติล็อกอิน
│   └── CreditLogsModal.tsx      # โมดัลแสดงประวัติเครดิต
├── hooks/
│   └── useAdminAuth.ts          # Hook ตรวจสอบสิทธิ์แอดมิน
├── lib/
│   └── adminService.ts          # Service สำหรับเรียก API
└── pages/admin/
    └── index.tsx                # หน้าหลักแอดมิน
```

### Backend Structure
```
server/
├── storage.ts                   # Database layer ด้วย Drizzle ORM
├── routes.ts                    # API endpoints สำหรับแอดมิน
└── index.ts                     # Express server configuration

shared/
└── schema.ts                    # Drizzle schema และ types
```

### Database Schema
```sql
-- ตารางผู้ใช้
users (id, username, email, password, name, role, status, created_at)

-- ตารางประวัติล็อกอิน  
login_logs (id, user_id, ip, user_agent, fingerprint, status, timestamp)

-- ตารางกระเป๋าเงิน
credit_wallets (id, user_id, balance, updated_at)

-- ตารางธุรกรรมเครดิต
credit_transactions (id, from_user_id, to_user_id, amount, type, status, note, balance_after, created_at)
```

## API Endpoints

### Authentication
- `GET /api/admin/auth` - ตรวจสอบสิทธิ์แอดมิน

### Dashboard Statistics
- `GET /api/admin/dashboard-stats` - ดึงสถิติภาพรวมระบบ

### User Management
- `GET /api/admin/users` - ดึงรายชื่อผู้ใช้ทั้งหมดพร้อมยอดเครดิต
- `PATCH /api/admin/users/:userId/status` - อัปเดตสถานะผู้ใช้

### Login Logs
- `GET /api/admin/users/:userId/login-logs` - ดึงประวัติล็อกอินของผู้ใช้

### Credit Transactions
- `GET /api/admin/users/:userId/credit-transactions` - ดึงประวัติธุรกรรมเครดิต

## ข้อมูลตัวอย่าง

ระบบจะสร้างข้อมูลตัวอย่างอัตโนมัติเมื่อเริ่มต้นครั้งแรก:

### ผู้ใช้ตัวอย่าง
1. **Admin User** - บัญชีผู้ดูแลระบบ
2. **สมชาย ใจดี** - ผู้ใช้งานปกติ (เครดิต 1,247.50 บาท)
3. **สมหญิง รักเงิน** - ผู้ใช้งานปกติ (เครดิต 2,847.25 บาท)
4. **ธนกร นักเล่น** - ผู้ใช้ถูกระงับ (เครดิต 156.75 บาท)

### ธุรกรรมตัวอย่าง
- ฝากเงินผ่านธนาคาร +500.00 บาท
- แพ้เกมบาคาร่า -150.00 บาท
- โบนัสสมาชิกใหม่ +50.00 บาท
- ชนะ Jackpot เกมสล็อต +300.00 บาท

## วิธีการพัฒนาต่อยอด

### เพิ่มฟีเจอร์ใหม่
1. **อนุมัติคำขอถอนเงิน** - เพิ่ม endpoint สำหรับอนุมัติ/ปฏิเสธ
2. **แก้ไขเครดิตผู้ใช้** - ฟังก์ชันเพิ่ม/ลดเครดิตแบบแมนนวล
3. **รายงานรายวัน/รายเดือน** - สถิติธุรกรรมตามช่วงเวลา
4. **ระบบแจ้งเตือน** - แจ้งเตือนกิจกรรมผิดปกติ

### การปรับแต่งฐานข้อมูล
```sql
-- เพิ่มตารางคำขอถอนเงิน
CREATE TABLE withdrawal_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  bank_account TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- เพิ่มตารางบันทึกการแก้ไขของแอดมิน
CREATE TABLE admin_actions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES users(id),
  target_user_id INTEGER REFERENCES users(id),
  action_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### การขยายระบบ Authentication
```typescript
// เพิ่มระดับสิทธิ์แอดมิน
enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  VIEWER = 'viewer'
}

// ตรวจสอบสิทธิ์ตามหน้าที่
function checkAdminPermission(role: AdminRole, action: string): boolean {
  const permissions = {
    super_admin: ['view', 'edit', 'delete', 'approve'],
    moderator: ['view', 'edit', 'approve'],
    viewer: ['view']
  };
  return permissions[role]?.includes(action) || false;
}
```

## การ Deploy และ Maintenance

### Environment Variables ที่จำเป็น
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### การ Backup ข้อมูล
```bash
# Backup ฐานข้อมูลรายวัน
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore จาก backup
psql $DATABASE_URL < backup_20240101.sql
```

### การ Monitor ประสิทธิภาพ
- ตรวจสอบ Query performance ด้วย `EXPLAIN ANALYZE`
- ใช้ Connection pooling สำหรับ Production
- ตั้งค่า Index สำหรับคอลัมน์ที่ใช้ค้นหาบ่อย

---

*คู่มือนี้อัปเดตล่าสุด: มกราคม 2025*
