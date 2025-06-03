import { pgTable, text, serial, integer, boolean, timestamp, decimal, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ตารางผู้ใช้งาน
export const users = pgTable("users", {
  id: serial("id").primaryKey(),                    // รหัสผู้ใช้ (Primary Key)
  username: text("username").notNull().unique(),    // ชื่อผู้ใช้ (ต้องไม่ซ้ำ)
  email: text("email").notNull().unique(),          // อีเมล (ต้องไม่ซ้ำ)
  password: text("password").notNull(),             // รหัสผ่าน (เข้ารหัส)
  name: text("name").notNull(),                     // ชื่อ-นามสกุล
  role: text("role").notNull().default("user"),     // บทบาท: "admin" หรือ "user"
  status: text("status").notNull().default("active"), // สถานะ: "active", "suspended", "banned"
  createdAt: timestamp("created_at").notNull().defaultNow(), // วันที่สร้างบัญชี
});

// ตารางประวัติการเข้าสู่ระบบ
export const loginLogs = pgTable("login_logs", {
  id: serial("id").primaryKey(),                    // รหัสล็อก
  userId: integer("user_id").notNull().references(() => users.id), // รหัสผู้ใช้
  ip: text("ip").notNull(),                         // IP Address
  userAgent: text("user_agent").notNull(),          // ข้อมูล Browser
  fingerprint: text("fingerprint"),                 // ลายนิ้วมือดิจิทัล (ถ้ามี)
  status: text("status").notNull(),                 // สถานะ: "success" หรือ "failure"
  timestamp: timestamp("timestamp").notNull().defaultNow(), // เวลาที่เข้าสู่ระบบ
});

// ตารางกระเป๋าเงินดิจิทัล
export const creditWallets = pgTable("credit_wallets", {
  id: serial("id").primaryKey(),                    // รหัสกระเป๋าเงิน
  userId: integer("user_id").notNull().references(() => users.id), // รหัสผู้ใช้
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"), // ยอดเงินคงเหลือ
  updatedAt: timestamp("updated_at").notNull().defaultNow(), // วันที่อัปเดตล่าสุด
});

// ตารางประวัติธุรกรรมเครดิต
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),                    // รหัสธุรกรรม
  fromUserId: integer("from_user_id").references(() => users.id), // ผู้ส่ง (ถ้ามี)
  toUserId: integer("to_user_id").references(() => users.id),     // ผู้รับ (ถ้ามี)
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // จำนวนเงิน
  type: text("type").notNull(),                     // ประเภท: "deposit", "withdrawal", "game_win", "game_loss", "bonus", "transfer"
  status: text("status").notNull().default("completed"), // สถานะ: "pending", "completed", "failed"
  note: text("note"),                               // หมายเหตุ
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }), // ยอดเงินหลังธุรกรรม
  createdAt: timestamp("created_at").notNull().defaultNow(), // วันที่ทำธุรกรรม
});

// ตารางโพสต์สำหรับโซเชียลมีเดีย
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  mediaUrl: text("media_url"), // URL รูปภาพ/วิดีโอ/ลิงก์
  mediaType: text("media_type"), // "image", "video", "link"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ตารางคอมเมนต์
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ตารางไลค์/ดิสไลค์
export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "like" | "dislike"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ตารางข้อความแชท
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").references(() => users.id), // null = ข้อความในโถงสาธารณะ
  roomId: text("room_id"), // สำหรับโถงแชทสาธารณะ เช่น 'public' หรือ 'lobby'
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'image', 'file'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ตารางคำขอสินเชื่อ
export const loanRequests = pgTable("loan_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // จำนวนเงินขอสินเชื่อ
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).default("5.00"), // อัตราดอกเบี้ยต่อชั่วโมง (%)
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(), // ยอดรวมที่ต้องชำระ
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected', 'paid'
  dueDate: timestamp("due_date"), // วันที่ครบกำหนดชำระ
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  note: text("note"), // หมายเหตุจากแอดมิน
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLoginLogSchema = createInsertSchema(loginLogs).omit({
  id: true,
  timestamp: true,
});

export const insertCreditWalletSchema = createInsertSchema(creditWallets).omit({
  id: true,
  updatedAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertPostLikeSchema = createInsertSchema(postLikes).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertLoanRequestSchema = createInsertSchema(loanRequests).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  rejectedAt: true,
});

export const shopItems = pgTable("shop_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  rarity: text("rarity").default("common"),
  description: text("description"),
  mediaUrl: text("media_url"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userItems = pgTable("user_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  itemId: integer("item_id").notNull().references(() => shopItems.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActiveItems = pgTable("user_active_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  itemId: integer("item_id").notNull().references(() => shopItems.id),
  type: text("type").notNull(),
  activatedAt: timestamp("activated_at").defaultNow(),
});

// Create the unique index separately
export const userActiveItemsUserTypeIdx = uniqueIndex("user_active_items_user_type_idx").on(userActiveItems.userId, userActiveItems.type);

export const insertShopItemSchema = createInsertSchema(shopItems).omit({
  id: true,
  createdAt: true,
});

export const insertUserItemSchema = createInsertSchema(userItems).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginLog = typeof loginLogs.$inferSelect;
export type InsertLoginLog = z.infer<typeof insertLoginLogSchema>;
export type CreditWallet = typeof creditWallets.$inferSelect;
export type InsertCreditWallet = z.infer<typeof insertCreditWalletSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type LoanRequest = typeof loanRequests.$inferSelect;
export type InsertLoanRequest = z.infer<typeof insertLoanRequestSchema>;

export type ShopItem = typeof shopItems.$inferSelect;
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;

export type UserItem = typeof userItems.$inferSelect;
export type InsertUserItem = z.infer<typeof insertUserItemSchema>;

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").default("cat"),
  name: text("name").default("สัตว์เลี้ยงของฉัน"),
  energy: integer("energy").default(100),
  mood: integer("mood").default(100),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  lastCollectedAt: timestamp("last_collected_at").defaultNow(),
  lastFedAt: timestamp("last_fed_at").defaultNow(),
  lastPlayedAt: timestamp("last_played_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
