# 📁 โครงสร้างโปรเจค BergDotBet B.B

## ภาพรวมโครงสร้าง

```
bergdotbet-bb/
├── 📁 client/src/                 # Frontend React Application
│   ├── 📁 components/             # Reusable UI Components
│   │   ├── 📁 pet/               # Pet System Components
│   │   ├── 📁 ui/                # Base UI Components (shadcn/ui)
│   │   ├── CommentSection.tsx    # Comment System
│   │   ├── NavigationBar.tsx     # Main Navigation
│   │   └── PostCard.tsx          # Social Media Post Card
│   │
│   ├── 📁 hooks/                 # Custom React Hooks
│   │   ├── use-mobile.tsx        # Mobile Detection Hook
│   │   └── use-toast.tsx         # Toast Notification Hook
│   │
│   ├── 📁 lib/                   # Utility Libraries
│   │   ├── adminService.ts       # Admin API Service
│   │   ├── queryClient.ts        # React Query Configuration
│   │   └── utils.ts              # Utility Functions
│   │
│   ├── 📁 modules/               # Feature Modules
│   │   ├── 📁 pet/              # Pet System Module
│   │   │   ├── petService.ts    # Pet API Service
│   │   │   └── usePet.ts        # Pet React Hooks
│   │   ├── 📁 shop/             # Shop System Module
│   │   │   ├── shopService.ts   # Shop API Service
│   │   │   └── useShop.ts       # Shop React Hooks
│   │   └── 📁 wallet/           # Wallet System Module
│   │       ├── walletService.ts # Wallet API Service
│   │       └── useWallet.ts     # Wallet React Hooks
│   │
│   ├── 📁 pages/                # Page Components
│   │   ├── 📁 admin/            # Admin Dashboard Pages
│   │   ├── 📁 chat/             # Chat System Pages
│   │   ├── 📁 feed/             # Social Media Feed
│   │   ├── 📁 loan/             # Loan System Pages
│   │   ├── 📁 pet/              # Pet System Pages
│   │   ├── 📁 post/             # Post Management Pages
│   │   ├── 📁 profile/          # User Profile Pages
│   │   ├── 📁 shop/             # Shop System Pages
│   │   ├── 📁 wallet/           # Wallet Management Pages
│   │   └── not-found.tsx        # 404 Page
│   │
│   ├── App.tsx                  # Main App Component & Router
│   ├── index.css                # Global Styles
│   └── main.tsx                 # React Entry Point
│
├── 📁 server/                   # Backend Express Application
│   ├── index.ts                 # Express Server Entry Point
│   ├── routes.ts                # API Routes Definition
│   ├── storage.ts               # Database Layer & Business Logic
│   └── vite.ts                  # Vite Integration for SSR
│
├── 📁 shared/                   # Shared Code Between Frontend & Backend
│   └── schema.ts                # Database Schema & Types (Drizzle ORM)
│
├── 📁 migrations/               # Database Migration Files
│   └── [timestamp]_migration.sql
│
├── 📁 docs/                     # Project Documentation
│   ├── PROJECT_STRUCTURE.md     # This File
│   └── API_DOCUMENTATION.md     # API Documentation
│
├── 📁 components.json           # shadcn/ui Configuration
├── 📁 drizzle.config.ts         # Drizzle ORM Configuration
├── 📁 package.json              # Project Dependencies & Scripts
├── 📁 tailwind.config.ts        # Tailwind CSS Configuration
├── 📁 tsconfig.json             # TypeScript Configuration
├── 📁 vite.config.ts            # Vite Build Configuration
├── 📁 vercel.json               # Vercel Deployment Configuration
├── 📁 .env.example              # Environment Variables Template
├── 📁 README.md                 # Project Overview & Setup Guide
└── 📁 DEPLOYMENT.md             # Deployment Instructions
```

## 🏗 Architecture Overview

### Frontend Architecture (React + TypeScript)
- **Component-Based**: แยกส่วน UI components ให้ reusable
- **Module-Based**: แยกฟีเจอร์ใหญ่เป็น modules พร้อม services และ hooks
- **Type-Safe**: ใช้ TypeScript สำหรับ type safety
- **State Management**: React Query สำหรับ server state, React hooks สำหรับ local state

### Backend Architecture (Express + TypeScript)
- **Layered Architecture**: แยกชั้น Routes, Storage, และ Business Logic
- **Database ORM**: Drizzle ORM สำหรับ type-safe database operations
- **Session-Based Auth**: Express session สำหรับ authentication
- **WebSocket Support**: Real-time communication สำหรับ chat

### Database Design (PostgreSQL + Supabase)
- **Relational Design**: ออกแบบตารางความสัมพันธ์ที่เหมาะสม
- **Type Generation**: Auto-generate TypeScript types จาก schema
- **Migration Support**: Version control สำหรับ database changes

## 📋 Feature Modules Detail

### 1. Admin System (`pages/admin/`)
- **Dashboard**: สถิติและภาพรวมระบบ
- **User Management**: จัดการผู้ใช้และสถานะ
- **Transaction Monitor**: ตรวจสอบธุรกรรมเครดิต
- **Loan Approval**: อนุมัติ/ปฏิเสธคำขอสินเชื่อ

### 2. Social Media Feed (`pages/feed/`)
- **Post Creation**: สร้างโพสต์ข้อความ, รูปภาพ, วิดีโอ
- **Interactive Feed**: ไลค์, ดิสไลค์, คอมเมนต์
- **Media Support**: แสดงผลมีเดียที่หลากหลาย
- **Real-time Updates**: อัปเดตแบบ real-time

### 3. Chat System (`pages/chat/`)
- **Public Chat**: ห้องแชทสาธารณะ
- **Private Chat**: แชทส่วนตัวระหว่างผู้ใช้
- **WebSocket**: การส่งข้อความแบบ real-time
- **Message History**: ประวัติข้อความ

### 4. Loan System (`pages/loan/`)
- **Loan Application**: ฟอร์มขอสินเชื่อ
- **Interest Calculation**: คำนวณดอกเบี้ยรายชั่วโมง
- **Eligibility Check**: ตรวจสอบสิทธิ์การขอสินเชื่อ
- **Status Tracking**: ติดตามสถานะคำขอ

### 5. Profile System (`pages/profile/`)
- **User Profile**: แสดงข้อมูลผู้ใช้
- **Post History**: โพสต์ของผู้ใช้
- **Credit Transfer**: โอนเครดิตระหว่างผู้ใช้
- **Activity Timeline**: ประวัติกิจกรรม

### 6. Wallet System (`pages/wallet/`)
- **Balance Display**: แสดงยอดเครดิต
- **Transaction History**: ประวัติธุรกรรมทั้งหมด
- **Top-up/Withdraw**: เติมเงิน/ถอนเงิน
- **Transfer System**: โอนเครดิต

### 7. Shop System (`pages/shop/`)
- **Item Catalog**: แค็ตตาล็อกไอเทม
- **Rarity System**: ระบบความหายาก (ธรรมดา, หายาก, เอปิก, ตำนาน)
- **Purchase System**: ซื้อด้วยเครดิต
- **Inventory**: ไอเทมที่เป็นเจ้าของ

### 8. Pet System (`pages/pet/`)
- **Pet Creation**: สร้างสัตว์เลี้ยง 6 ประเภท
- **Pet Care**: ให้อาหาร, เล่น, ดูแล
- **Credit Generation**: เก็บเกี่ยวเครดิตจากสัตว์เลี้ยง
- **Level System**: ระบบเลเวลและประสบการณ์

## 🔧 Technical Implementation

### State Management Pattern
```typescript
// Service Layer (API calls)
export const petService = {
  getUserPet: (userId: number) => Promise<Pet>,
  createPet: (data) => Promise<Pet>,
  performAction: (action) => Promise<ActionResult>
}

// Hook Layer (React Query + Business Logic)
export function useUserPet(userId: number) {
  return useQuery({
    queryKey: ["/api/pet", userId],
    queryFn: () => petService.getUserPet(userId)
  })
}

// Component Layer (UI + State Consumption)
export function PetPage() {
  const { data: pet } = useUserPet(userId)
  const actionMutation = usePetAction()
  
  return <PetStatus pet={pet} onAction={actionMutation.mutate} />
}
```

### Database Schema Pattern
```typescript
// Table Definition
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").default("cat"),
  name: text("name").default("สัตว์เลี้ยงของฉัน"),
  // ... other fields
})

// Type Generation
export type Pet = typeof pets.$inferSelect
export type InsertPet = z.infer<typeof insertPetSchema>
```

### API Route Pattern
```typescript
// Validation + Business Logic
app.post("/api/pet/action", async (req, res) => {
  const { userId, action } = req.body
  
  if (!userId || !action) {
    return res.status(400).json({ error: "Missing fields" })
  }

  const result = await storage.performPetAction(userId, action)
  res.json({ success: true, ...result })
})
```

## 🎯 Development Guidelines

### Code Organization
1. **Feature-First**: จัดกลุ่มไฟล์ตามฟีเจอร์ ไม่ใช่ตามประเภทไฟล์
2. **Separation of Concerns**: แยก UI, Business Logic, และ Data Layer
3. **Type Safety**: ใช้ TypeScript อย่างเต็มประสิทธิภาพ
4. **Consistent Naming**: ตั้งชื่อไฟล์และ function แบบสม่ำเสมอ

### Performance Considerations
1. **Code Splitting**: แยก bundle ตามหน้า
2. **Lazy Loading**: โหลดคอมโพเนนท์เมื่อจำเป็น
3. **Query Optimization**: ใช้ React Query caching
4. **Database Indexing**: สร้าง index ที่เหมาะสม

### Security Best Practices
1. **Input Validation**: ตรวจสอบข้อมูลทุก input
2. **SQL Injection Protection**: ใช้ ORM parameters
3. **XSS Prevention**: Sanitize user content
4. **Session Security**: Secure session configuration

---

โครงสร้างนี้ออกแบบมาเพื่อความยืดหยุ่น, ความสามารถในการบำรุงรักษา, และการขยายตัวในอนาคต