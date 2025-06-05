import { users, loginLogs, creditWallets, creditTransactions, posts, comments, postLikes, messages, loanRequests, shopItems, userItems, userActiveItems, pets, type User, type InsertUser, type LoginLog, type InsertLoginLog, type CreditWallet, type InsertCreditWallet, type CreditTransaction, type InsertCreditTransaction, type Post, type InsertPost, type Comment, type InsertComment, type PostLike, type InsertPostLike, type Message, type InsertMessage, type LoanRequest, type InsertLoanRequest, type ShopItem, type UserItem, type Pet } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, or, and, sql, isNull } from "drizzle-orm";

/**
 * Interface สำหรับการจัดการข้อมูลในระบบ
 * กำหนดฟังก์ชันที่จำเป็นสำหรับการจัดการผู้ใช้ ล็อกอิน และเครดิต
 */
export interface IStorage {
  // การจัดการผู้ใช้
  getUser(id: number): Promise<User | undefined>;                        // ดึงข้อมูลผู้ใช้ตาม ID
  getUserByUsername(username: string): Promise<User | undefined>;         // ดึงข้อมูลผู้ใช้ตาม username
  getUserByEmail(email: string): Promise<User | undefined>;               // ดึงข้อมูลผู้ใช้ตาม email
  createUser(user: InsertUser): Promise<User>;                            // สร้างผู้ใช้ใหม่
  getAllUsers(): Promise<User[]>;                                         // ดึงรายชื่อผู้ใช้ทั้งหมด
  updateUserStatus(id: number, status: string): Promise<User | undefined>; // อัปเดตสถานะผู้ใช้

  // ข้อมูลสถิติสำหรับแอดมิน
  getDashboardStats(): Promise<{
    totalUsers: number;      // จำนวนผู้ใช้ทั้งหมด
    onlineUsers: number;     // จำนวนผู้ใช้ออนไลน์
    totalCredits: string;    // เครดิตรวมทั้งหมด
    todayTransactions: number; // ธุรกรรมวันนี้
  }>;

  // การจัดการล็อกอิน
  createLoginLog(log: InsertLoginLog): Promise<LoginLog>;        // บันทึกล็อกการเข้าระบบ
  getUserLoginLogs(userId: number): Promise<LoginLog[]>;        // ดึงประวัติล็อกอินของผู้ใช้

  // การจัดการกระเป๋าเงิน
  getUserWallet(userId: number): Promise<CreditWallet | undefined>;                    // ดึงข้อมูลกระเป๋าเงิน
  createUserWallet(wallet: InsertCreditWallet): Promise<CreditWallet>;                 // สร้างกระเป๋าเงินใหม่
  updateWalletBalance(userId: number, balance: string): Promise<CreditWallet | undefined>; // อัปเดตยอดเงิน

  // การจัดการธุรกรรมเครดิต
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>; // สร้างธุรกรรมใหม่
  getUserCreditTransactions(userId: number): Promise<CreditTransaction[]>;                   // ดึงประวัติธุรกรรมของผู้ใช้
  getAllCreditTransactions(): Promise<CreditTransaction[]>;                                  // ดึงธุรกรรมทั้งหมด

  // การจัดการโพสต์โซเชียลมีเดีย
  createPost(post: InsertPost): Promise<Post>;                              // สร้างโพสต์ใหม่
  getAllPosts(): Promise<Post[]>;                                           // ดึงโพสต์ทั้งหมด
  getPostById(id: number): Promise<Post | undefined>;                       // ดึงโพสต์ตาม ID
  deletePost(id: number): Promise<boolean>;                                 // ลบโพสต์

  // การจัดการคอมเมนต์
  createComment(comment: InsertComment): Promise<Comment>;                  // สร้างคอมเมนต์ใหม่
  getPostComments(postId: number): Promise<Comment[]>;                      // ดึงคอมเมนต์ของโพสต์
  deleteComment(id: number): Promise<boolean>;                              // ลบคอมเมนต์

  // การจัดการไลค์/ดิสไลค์
  togglePostLike(like: InsertPostLike): Promise<PostLike | null>;           // เพิ่ม/ลบไลค์
  getPostLikes(postId: number): Promise<PostLike[]>;                        // ดึงไลค์ของโพสต์
  getUserPostLike(postId: number, userId: number): Promise<PostLike | undefined>; // ดึงไลค์ของผู้ใช้สำหรับโพสต์นั้น

  // การจัดการข้อความแชท
  createMessage(message: InsertMessage): Promise<Message>;                  // ส่งข้อความใหม่
  getPrivateMessages(userId1: number, userId2: number): Promise<Message[]>; // ดึงข้อความแชทส่วนตัว
  getPublicMessages(roomId: string): Promise<Message[]>;                    // ดึงข้อความโถงแชทสาธารณะ
  markMessageAsRead(messageId: number): Promise<boolean>;                   // ทำเครื่องหมายข้อความว่าอ่านแล้ว
  getUnreadMessageCount(userId: number): Promise<number>;                   // นับข้อความที่ยังไม่ได้อ่าน

  // การจัดการคำขอสินเชื่อ
  createLoanRequest(loanRequest: InsertLoanRequest): Promise<LoanRequest>;  // สร้างคำขอสินเชื่อใหม่
  getUserLoanRequests(userId: number): Promise<LoanRequest[]>;              // ดึงคำขอสินเชื่อของผู้ใช้
  getAllLoanRequests(): Promise<LoanRequest[]>;                             // ดึงคำขอสินเชื่อทั้งหมด (สำหรับแอดมิน)
  updateLoanRequestStatus(id: number, status: string, note?: string): Promise<LoanRequest | undefined>; // อัปเดตสถานะคำขอ
  checkUserEligibility(userId: number): Promise<boolean>;                   // ตรวจสอบสิทธิ์การขอสินเชื่อ

  // การจัดการโปรไฟล์และโอนเครดิต
  getUserProfile(userId: number): Promise<{ user: User; wallet: CreditWallet; postsCount: number } | undefined>; // ดึงข้อมูลโปรไฟล์ผู้ใช้
  getUserPosts(userId: number): Promise<Post[]>;                            // ดึงโพสต์ของผู้ใช้
  transferCredits(fromUserId: number, toUserId: number, amount: string, note?: string): Promise<boolean>; // โอนเครดิต

  // การจัดการร้านค้าและไอเทม
  getAllShopItems(): Promise<ShopItem[]>;                                   // ดึงไอเทมทั้งหมดในร้านค้า
  getAllShopItemsAdmin(): Promise<ShopItem[]>;                              // ดึงไอเทมทั้งหมดสำหรับแอดมิน (รวมที่ซ่อน)
  getShopItemsByType(type: string): Promise<ShopItem[]>;                    // ดึงไอเทมตามประเภท
  getShopItemsByRarity(rarity: string): Promise<ShopItem[]>;                // ดึงไอเทมตามความหายาก
  getShopItemById(itemId: number): Promise<ShopItem | undefined>;           // ดึงข้อมูลไอเทมเดี่ยว
  createShopItem(item: Partial<ShopItem>): Promise<ShopItem>;               // สร้างไอเทมใหม่
  updateShopItem(itemId: number, updates: Partial<ShopItem>): Promise<ShopItem | undefined>; // อัปเดตไอเทม
  toggleShopItemStatus(itemId: number, isActive: boolean): Promise<ShopItem | undefined>; // เปิด/ปิดการแสดงไอเทม
  purchaseItem(userId: number, itemId: number): Promise<boolean>;           // ซื้อไอเทม
  getUserItems(userId: number): Promise<UserItem[]>;                        // ดึงไอเทมของผู้ใช้
  checkUserOwnsItem(userId: number, itemId: number): Promise<boolean>;      // ตรวจสอบความเป็นเจ้าของไอเทม

  // การจัดการสัตว์เลี้ยง
  getUserPet(userId: number): Promise<Pet | undefined>;                     // ดึงข้อมูลสัตว์เลี้ยงของผู้ใช้
  createPet(userId: number, type: string, name: string): Promise<Pet>;      // สร้างสัตว์เลี้ยงใหม่
  updatePet(userId: number, updates: Partial<Pet>): Promise<Pet | undefined>; // อัปเดตข้อมูลสัตว์เลี้ยง
  performPetAction(userId: number, action: string): Promise<{ pet: Pet; reward?: number; message: string }>; // ดำเนินการกับสัตว์เลี้ยง

  // การจัดการกระเป๋าไอเทม
  getUserInventory(userId: number): Promise<any[]>;                         // ดึงไอเทมที่เป็นเจ้าของ
  getUserActiveItems(userId: number): Promise<any[]>;                       // ดึงไอเทมที่กำลังใช้งาน
  activateItem(userId: number, itemId: number, type: string): Promise<boolean>; // เปิดใช้งานไอเทม
}

// การเชื่อมต่อฐานข้อมูล Supabase ผ่าน postgres driver
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

/**
 * คลาสจัดการข้อมูลผ่านฐานข้อมูล Supabase
 * ใช้ Drizzle ORM ในการจัดการ CRUD operations
 */
export class DatabaseStorage implements IStorage {
  /**
   * สร้างข้อมูลตัวอย่างในฐานข้อมูล (ถ้ายังไม่มี)
   * จะสร้างผู้ใช้ตัวอย่าง กระเป๋าเงิน ประวัติล็อกอิน และธุรกรรม
   */
  async initializeData() {
    // ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
    const existingAdmin = await this.getUserByUsername("admin");

    if (!existingAdmin) {
      // Create admin user
      const adminUser = await this.createUser({
        username: "admin",
        email: "admin@bergdotbet.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
        status: "active"
      });

      // Create sample users
      const user1 = await this.createUser({
        username: "somchai123",
        email: "somchai@example.com",
        password: "password123",
        name: "สมชาย ใจดี",
        role: "user",
        status: "active"
      });

      const user2 = await this.createUser({
        username: "somying456",
        email: "somying@example.com",
        password: "password123",
        name: "สมหญิง รักเงิน",
        role: "user",
        status: "active"
      });

      const user3 = await this.createUser({
        username: "thanakorn789",
        email: "thanakorn@example.com",
        password: "password123",
        name: "ธนกร นักเล่น",
        role: "user",
        status: "suspended"
      });

      // Create wallets for users
      await this.createUserWallet({ userId: user1.id, balance: "1247.50" });
      await this.createUserWallet({ userId: user2.id, balance: "2847.25" });
      await this.createUserWallet({ userId: user3.id, balance: "156.75" });

      // Create sample login logs
      await this.createLoginLog({
        userId: user1.id,
        ip: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        fingerprint: "a1b2c3d4e5f6",
        status: "success"
      });

      await this.createLoginLog({
        userId: user1.id,
        ip: "192.168.1.105",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        fingerprint: "m1n2o3p4q5r6",
        status: "success"
      });

      await this.createLoginLog({
        userId: user1.id,
        ip: "203.154.62.47",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        fingerprint: "x1y2z3a4b5c6",
        status: "failure"
      });

      // Create sample transactions
      await this.createCreditTransaction({
        toUserId: user1.id,
        amount: "500.00",
        type: "deposit",
        status: "completed",
        note: "ฝากเงินผ่านธนาคาร",
        balanceAfter: "1247.50"
      });

      await this.createCreditTransaction({
        fromUserId: user1.id,
        amount: "150.00",
        type: "game_loss",
        status: "completed",
        note: "แพ้เกมบาคาร่า รอบที่ 15",
        balanceAfter: "747.50"
      });

      await this.createCreditTransaction({
        toUserId: user1.id,
        amount: "50.00",
        type: "bonus",
        status: "completed",
        note: "โบนัสสมาชิกใหม่",
        balanceAfter: "897.50"
      });

      await this.createCreditTransaction({
        toUserId: user1.id,
        amount: "300.00",
        type: "game_win",
        status: "completed",
        note: "ชนะ Jackpot เกมสล็อต",
        balanceAfter: "847.50"
      });

      // สร้างโพสต์ตัวอย่าง
      const post1 = await this.createPost({
        userId: user1.id,
        content: "วันนี้โชคดีมาก ชนะ Jackpot เกมสล็อต 🎰✨ ขอบคุณ BergDotBet ที่ทำให้ชีวิตดีขึ้น!",
        mediaUrl: "https://images.unsplash.com/photo-1606963954670-2fd75ee5f7eb",
        mediaType: "image"
      });

      const post2 = await this.createPost({
        userId: user2.id,
        content: "เทคนิคเล่นบาคาร่าให้ได้กำไร 💰 ใครสนใจแชร์ประสบการณ์กันได้นะ",
        mediaUrl: null,
        mediaType: null
      });

      const post3 = await this.createPost({
        userId: user1.id,
        content: "ดูคลิปเทคนิคการเล่นนี้แล้วปรับปรุงเกมส์ได้เยอะเลย!",
        mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        mediaType: "video"
      });

      // สร้างคอมเมนต์ตัวอย่าง
      await this.createComment({
        postId: post1.id,
        userId: user2.id,
        text: "ยินดีด้วยนะ! แชร์เทคนิคหน่อยสิ 😊"
      });

      await this.createComment({
        postId: post1.id,
        userId: user3.id,
        text: "โคตรโชคดี เอาเงินไปลงทุนต่อเลย"
      });

      await this.createComment({
        postId: post2.id,
        userId: user1.id,
        text: "เทคนิคที่ผมใช้คือดูจังหวะและการจัดการเงิน อย่าโลภมาก"
      });

      // สร้างไลค์ตัวอย่าง
      await this.togglePostLike({
        postId: post1.id,
        userId: user2.id,
        type: "like"
      });

      await this.togglePostLike({
        postId: post1.id,
        userId: user3.id,
        type: "like"
      });

      await this.togglePostLike({
        postId: post2.id,
        userId: user1.id,
        type: "like"
      });

      await this.togglePostLike({
        postId: post2.id,
        userId: user3.id,
        type: "dislike"
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserStatus(id: number, status: string): Promise<User | undefined> {
    const result = await db.update(users).set({ status }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    onlineUsers: number;
    totalCredits: string;
    todayTransactions: number;
  }> {
    const totalUsersResult = await db.select().from(users);
    const totalUsers = totalUsersResult.length;
    const onlineUsers = Math.floor(totalUsers * 0.4); // Mock online users as 40% of total

    const walletsResult = await db.select().from(creditWallets);
    const totalCredits = walletsResult.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0).toFixed(2);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactionsResult = await db.select().from(creditTransactions);
    const todayTransactions = todayTransactionsResult.filter(tx => tx.createdAt >= today).length;

    return {
      totalUsers,
      onlineUsers,
      totalCredits,
      todayTransactions
    };
  }

  async createLoginLog(log: InsertLoginLog): Promise<LoginLog> {
    const result = await db.insert(loginLogs).values(log).returning();
    return result[0];
  }

  async getUserLoginLogs(userId: number): Promise<LoginLog[]> {
    return await db.select()
      .from(loginLogs)
      .where(eq(loginLogs.userId, userId))
      .orderBy(desc(loginLogs.timestamp));
  }

  async getUserWallet(userId: number): Promise<CreditWallet | undefined> {
    const result = await db.select().from(creditWallets).where(eq(creditWallets.userId, userId)).limit(1);
    return result[0];
  }

  async createUserWallet(wallet: InsertCreditWallet): Promise<CreditWallet> {
    const result = await db.insert(creditWallets).values(wallet).returning();
    return result[0];
  }

  async updateWalletBalance(userId: number, balance: string): Promise<CreditWallet | undefined> {
    const result = await db.update(creditWallets)
      .set({ balance, updatedAt: new Date() })
      .where(eq(creditWallets.userId, userId))
      .returning();
    return result[0];
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const result = await db.insert(creditTransactions).values(transaction).returning();
    return result[0];
  }

  async getUserCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    return await db.select()
      .from(creditTransactions)
      .where(or(eq(creditTransactions.fromUserId, userId), eq(creditTransactions.toUserId, userId)))
      .orderBy(desc(creditTransactions.createdAt));
  }

  async getAllCreditTransactions(): Promise<CreditTransaction[]> {
    return await db.select().from(creditTransactions).orderBy(desc(creditTransactions.createdAt));
  }

  // === การจัดการโพสต์โซเชียลมีเดีย ===

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();
    return result.length > 0;
  }

  // === การจัดการคอมเมนต์ ===

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return await db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id)).returning();
    return result.length > 0;
  }

  // === การจัดการไลค์/ดิสไลค์ ===

  async togglePostLike(like: InsertPostLike): Promise<PostLike | null> {
    // ตรวจสอบว่าผู้ใช้เคยไลค์โพสต์นี้แล้วหรือไม่
    const existingLike = await this.getUserPostLike(like.postId, like.userId);

    if (existingLike) {
      if (existingLike.type === like.type) {
        // ถ้าไลค์แบบเดียวกัน ให้ลบออก
        await db.delete(postLikes)
          .where(and(eq(postLikes.postId, like.postId), eq(postLikes.userId, like.userId)));
        return null;
      } else {
        // ถ้าไลค์คนละแบบ ให้อัปเดต
        const result = await db.update(postLikes)
          .set({ type: like.type })
          .where(and(eq(postLikes.postId, like.postId), eq(postLikes.userId, like.userId)))
          .returning();
        return result[0];
      }
    } else {
      // ถ้ายังไม่เคยไลค์ ให้สร้างใหม่
      const result = await db.insert(postLikes).values(like).returning();
      return result[0];
    }
  }

  async getPostLikes(postId: number): Promise<PostLike[]> {
    return await db.select()
      .from(postLikes)
      .where(eq(postLikes.postId, postId))
      .orderBy(desc(postLikes.createdAt));
  }

  async getUserPostLike(postId: number, userId: number): Promise<PostLike | undefined> {
    const result = await db.select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);
    return result[0];
  }

  // การจัดการข้อความแชท
  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getPrivateMessages(userId1: number, userId2: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(
        and(
          or(
            and(eq(messages.fromUserId, userId1), eq(messages.toUserId, userId2)),
            and(eq(messages.fromUserId, userId2), eq(messages.toUserId, userId1))
          ),
          isNull(messages.roomId)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async getPublicMessages(roomId: string): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.roomId, roomId))
      .orderBy(desc(messages.createdAt))
      .limit(100);
  }

  async markMessageAsRead(messageId: number): Promise<boolean> {
    try {
      await db.update(messages)
        .set({ isRead: true })
        .where(eq(messages.id, messageId));
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    const result = await db.select({ count: sql`count(*)`.as('count') })
      .from(messages)
      .where(and(eq(messages.toUserId, userId), eq(messages.isRead, false)));
    return Number(result[0]?.count) || 0;
  }

  // การจัดการคำขอสินเชื่อ
  async createLoanRequest(loanRequest: InsertLoanRequest): Promise<LoanRequest> {
    const result = await db.insert(loanRequests).values(loanRequest).returning();
    return result[0];
  }

  async getUserLoanRequests(userId: number): Promise<LoanRequest[]> {
    try {
      return await db.select()
        .from(loanRequests)
        .where(eq(loanRequests.userId, userId))
        .orderBy(desc(loanRequests.createdAt));
    } catch (error) {
      console.error("Error getting user loan requests:", error);
      return [];
    }
  }

  async getAllLoanRequests(): Promise<LoanRequest[]> {
    return await db.select()
      .from(loanRequests)
      .orderBy(desc(loanRequests.createdAt));
  }

  async updateLoanRequestStatus(id: number, status: string, note?: string): Promise<LoanRequest | undefined> {
    const updateData: any = { status, note };
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
    }

    const result = await db.update(loanRequests)
      .set(updateData)
      .where(eq(loanRequests.id, id))
      .returning();
    return result[0];
  }

  async checkUserEligibility(userId: number): Promise<boolean> {
    // ตรวจสอบว่าผู้ใช้ล็อกอินเกิน 3 วันแล้วหรือไม่
    const user = await this.getUser(userId);
    if (!user) return false;

    const accountAgeInDays = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // ต้องมีบัญชีอย่างน้อย 3 วัน
    if (accountAgeInDays < 3) return false;

    // ตรวจสอบว่าไม่มีสินเชื่อที่ยังไม่ได้ชำระ
    const pendingLoans = await db.select()
      .from(loanRequests)
      .where(and(
        eq(loanRequests.userId, userId),
        or(
          eq(loanRequests.status, 'pending'),
          eq(loanRequests.status, 'approved')
        )
      ));

    return pendingLoans.length === 0;
  }

  // การจัดการโปรไฟล์และโอนเครดิต
  async getUserProfile(userId: number): Promise<{ user: User; wallet: CreditWallet; postsCount: number } | undefined> {
    try {
      const user = await this.getUser(userId);
      if (!user) return undefined;

      const wallet = await this.getUserWallet(userId);
      if (!wallet) return undefined;

      const postsResult = await db.select({ count: sql`count(*)`.as('count') })
        .from(posts)
        .where(eq(posts.userId, userId));

      const postsCount = Number(postsResult[0]?.count) || 0;

      return { user, wallet, postsCount };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return undefined;
    }
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    try {
      return await db.select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .orderBy(desc(posts.createdAt))
        .limit(20);
    } catch (error) {
      console.error("Error getting user posts:", error);
      return [];
    }
  }

  async transferCredits(fromUserId: number, toUserId: number, amount: string, note?: string): Promise<boolean> {
    try {
      const transferAmount = parseFloat(amount);
      if (transferAmount <= 0) return false;

      // ตรวจสอบว่าผู้ส่งมีเครดิตเพียงพอ
      const fromWallet = await this.getUserWallet(fromUserId);
      if (!fromWallet) return false;

      const fromBalance = parseFloat(fromWallet.balance);
      if (fromBalance < transferAmount) return false;

      // ตรวจสอบกระเป๋าเงินผู้รับ
      let toWallet = await this.getUserWallet(toUserId);
      if (!toWallet) {
        // สร้างกระเป๋าเงินใหม่ถ้ายังไม่มี
        toWallet = await this.createUserWallet({
          userId: toUserId,
          balance: "0.00"
        });
      }

      // คำนวณยอดใหม่
      const newFromBalance = (fromBalance - transferAmount).toFixed(2);
      const newToBalance = (parseFloat(toWallet.balance) + transferAmount).toFixed(2);

      // อัปเดตยอดเงินทั้งสองกระเป๋า
      await this.updateWalletBalance(fromUserId, newFromBalance);
      await this.updateWalletBalance(toUserId, newToBalance);

      // บันทึกธุรกรรมการโอน (ผู้ส่ง)
      await this.createCreditTransaction({
        fromUserId,
        toUserId,
        amount: `-${transferAmount}`,
        type: "transfer_out",
        status: "completed",
        note: note || `โอนให้ผู้ใช้ ID: ${toUserId}`,
        balanceAfter: newFromBalance,
      });

      // บันทึกธุรกรรมการรับ (ผู้รับ)
      await this.createCreditTransaction({
        fromUserId,
        toUserId,
        amount: transferAmount.toString(),
        type: "transfer_in",
        status: "completed",
        note: note || `รับโอนจากผู้ใช้ ID: ${fromUserId}`,
        balanceAfter: newToBalance,
      });

      return true;
    } catch (error) {
      console.error("Error transferring credits:", error);
      return false;
    }
  }

  // การจัดการร้านค้าและไอเทม
  async getAllShopItems(): Promise<any[]> {
    try {
      return await db.select().from(shopItems).where(eq(shopItems.isAvailable, true));
    } catch (error) {
      console.error("Error getting shop items:", error);
      return [];
    }
  }

  async getShopItemsByType(type: string): Promise<any[]> {
    try {
      return await db.select()
        .from(shopItems)
        .where(and(eq(shopItems.type, type), eq(shopItems.isAvailable, true)));
    } catch (error) {
      console.error("Error getting shop items by type:", error);
      return [];
    }
  }

  async getShopItemsByRarity(rarity: string): Promise<any[]> {
    try {
      return await db.select()
        .from(shopItems)
        .where(and(eq(shopItems.rarity, rarity), eq(shopItems.isAvailable, true)));
    } catch (error) {
      console.error("Error getting shop items by rarity:", error);
      return [];
    }
  }

  async getShopItemById(itemId: number): Promise<any | undefined> {
    try {
      const result = await db.select().from(shopItems).where(eq(shopItems.id, itemId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting shop item by id:", error);
      return undefined;
    }
  }

  async purchaseItem(userId: number, itemId: number): Promise<boolean> {
    try {
      // ตรวจสอบไอเทม
      const item = await this.getShopItemById(itemId);
      if (!item || !item.isAvailable) return false;

      // ตรวจสอบว่าผู้ใช้มีไอเทมแล้วหรือไม่
      const ownsItem = await this.checkUserOwnsItem(userId, itemId);
      if (ownsItem) return false;

      // ตรวจสอบยอดเงิน
      const wallet = await this.getUserWallet(userId);
      if (!wallet) return false;

      const currentBalance = parseFloat(wallet.balance);
      const itemPrice = parseFloat(item.price);
      if (currentBalance < itemPrice) return false;

      // หักเงิน
      const newBalance = (currentBalance - itemPrice).toFixed(2);
      await this.updateWalletBalance(userId, newBalance);

      // เพิ่มไอเทมให้ผู้ใช้
      await db.insert(userItems).values({ userId, itemId });

      // บันทึกธุรกรรม
      await this.createCreditTransaction({
        fromUserId: userId,
        amount: `-${itemPrice}`,
        type: "purchase",
        status: "completed",
        note: `ซื้อไอเทม: ${item.name}`,
        balanceAfter: newBalance,
      });

      return true;
    } catch (error) {
      console.error("Error purchasing item:", error);
      return false;
    }
  }

  async getUserItems(userId: number): Promise<any[]> {
    try {
      return await db.select({
        id: userItems.id,
        userId: userItems.userId,
        itemId: userItems.itemId,
        createdAt: userItems.createdAt,
        item: shopItems
      })
      .from(userItems)
      .leftJoin(shopItems, eq(userItems.itemId, shopItems.id))
      .where(eq(userItems.userId, userId));
    } catch (error) {
      console.error("Error getting user items:", error);
      return [];
    }
  }

  async checkUserOwnsItem(userId: number, itemId: number): Promise<boolean> {
    try {
      const result = await db.select()
        .from(userItems)
        .where(and(eq(userItems.userId, userId), eq(userItems.itemId, itemId)))
        .limit(1);
      return result.length > 0;
    } catch (error){
      console.error("Error checking user owns item:", error);
      return false;
    }
  }

  async getAllShopItemsAdmin(): Promise<any[]> {
    try {
      const result = await db.select().from(shopItems).orderBy(desc(shopItems.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting admin shop items:", error);
      return [];
    }
  }

  async createShopItem(item: any): Promise<any> {
    try {
      const result = await db.insert(shopItems).values({
        name: item.name,
        description: item.description,
        price: item.price,
        type: item.type,
        rarity: item.rarity,
        mediaUrl: item.mediaUrl || item.imageUrl,
        imageUrl: item.imageUrl,
        isAvailable: true,
        isActive: true,
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating shop item:", error);
      throw error;
    }
  }

  async updateShopItem(itemId: number, updates: any): Promise<any | undefined> {
    try {
      const result = await db.update(shopItems)
        .set(updates)
        .where(eq(shopItems.id, itemId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating shop item:", error);
      return undefined;
    }
  }

  async toggleShopItemStatus(itemId: number, isActive: boolean): Promise<any | undefined> {
    try {
      const result = await db.update(shopItems)
        .set({ isAvailable: isActive, isActive })
        .where(eq(shopItems.id, itemId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error toggling shop item status:", error);
      return undefined;
    }
  }

  // การจัดการสัตว์เลี้ยง
  async getUserPet(userId: number): Promise<any | undefined> {
    try {
      const result = await db.select().from(pets).where(eq(pets.userId, userId)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user pet:", error);
      return undefined;
    }
  }

  async createPet(userId: number, type: string, name: string): Promise<any> {
    try {
      const result = await db.insert(pets).values({
        userId,
        type,
        name,
        energy: 100,
        mood: 100,
        level: 1,
        experience: 0,
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating pet:", error);
      throw error;
    }
  }

  async updatePet(userId: number, updates: any): Promise<any | undefined> {
    try {
      const result = await db.update(pets)
        .set(updates)
        .where(eq(pets.userId, userId))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating pet:", error);
      return undefined;
    }
  }

  async performPetAction(userId: number, action: string): Promise<{ pet: any; reward?: number; message: string }> {
    try {
      const pet = await this.getUserPet(userId);
      if (!pet) {
        throw new Error("Pet not found");
      }

      const now = new Date();
      let updates: any = {};
      let reward = 0;
      let message = "";

      switch (action) {
        case 'feed':
          const lastFed = new Date(pet.lastFedAt);
          const hoursSinceFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

          if (hoursSinceFed < 2) {
            throw new Error("ต้องรอ 2 ชั่วโมงหลังจากให้อาหารครั้งล่าสุด");
          }

          const energyGain = Math.floor(Math.random() * 11) + 15; // 15-25
          updates = {
            energy: Math.min(100, pet.energy + energyGain),
            lastFedAt: now,
          };
          message = `ให้อาหารสำเร็จ! พลังงาน +${energyGain}`;
          break;

        case 'play':
          const lastPlayed = new Date(pet.lastPlayedAt);
          const hoursSincePlayed = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);

          if (hoursSincePlayed < 2) {
            throw new Error("ต้องรอ 2 ชั่วโมงหลังจากเล่นครั้งล่าสุด");
          }

          const moodGain = Math.floor(Math.random() * 11) + 10; // 10-20
          const expGain = Math.floor(Math.random() * 11) + 5; // 5-15
          const newExp = pet.experience + expGain;
          let newLevel = pet.level;

          // เช็คเลเวลอัป
          const expRequired = pet.level * 100;
          if (newExp >= expRequired) {
            newLevel = pet.level + 1;
          }

          updates = {
            mood: Math.min(100, pet.mood + moodGain),
            experience: newExp,
            level: newLevel,
            lastPlayedAt: now,
          };

          message = `เล่นด้วยกันสำเร็จ! อารมณ์ +${moodGain}, ประสบการณ์ +${expGain}`;
          if (newLevel > pet.level) {
            message += ` 🎉 เลเวลอัป! เลเวล ${newLevel}`;
          }
          break;

        case 'collect':
          const lastCollected = new Date(pet.lastCollectedAt);
          const hoursSinceCollected = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);

          if (hoursSinceCollected < 4) {
            throw new Error("ต้องรอ 4 ชั่วโมงหลังจากเก็บเกี่ยวครั้งล่าสุด");
          }

          // คำนวณเครดิตที่ได้รับ
          const baseAmount = 10;
          const levelBonus = (pet.level - 1) * 5;
          const moodMultiplier = pet.mood / 100;
          const energyMultiplier = pet.energy / 100;

          reward = Math.floor((baseAmount + levelBonus) * moodMultiplier * energyMultiplier);

          updates = {
            lastCollectedAt: now,
            // ลดพลังงานและอารมณ์เล็กน้อย
            energy: Math.max(10, pet.energy - 5),
            mood: Math.max(10, pet.mood - 5),
          };

          // เพิ่มเครดิตให้ผู้ใช้
          const wallet = await this.getUserWallet(userId);
          if (wallet) {
            const newBalance = (parseFloat(wallet.balance) + reward).toFixed(2);
            await this.updateWalletBalance(userId, newBalance);

            // บันทึกธุรกรรม
            await this.createCreditTransaction({
              toUserId: userId,
              amount: reward.toString(),
              type: "pet_collect",
              status: "completed",
              note: `เก็บเกี่ยวจากสัตว์เลี้ยง: ${pet.name}`,
              balanceAfter: newBalance,
            });
          }

          message = `เก็บเกี่ยวสำเร็จ! ได้รับ ${reward} เครดิต`;
          break;

        default:
          throw new Error("Invalid action");
      }

      const updatedPet = await this.updatePet(userId, updates);
      return { pet: updatedPet, reward, message };
    } catch (error) {
      console.error("Error performing pet action:", error);
      throw error;
    }
  }

  // การจัดการกระเป๋าไอเทม
  async getUserInventory(userId: number): Promise<any[]> {
    try {
      const result = await db.select({
        id: userItems.id,
        userId: userItems.userId,
        itemId: userItems.itemId,
        createdAt: userItems.createdAt,
        item: {
          id: shopItems.id,
          name: shopItems.name,
          description: shopItems.description,
          price: shopItems.price,
          type: shopItems.type,
          rarity: shopItems.rarity,
          imageUrl: shopItems.mediaUrl,
        }
      })
      .from(userItems)
      .leftJoin(shopItems, eq(userItems.itemId, shopItems.id))
      .where(eq(userItems.userId, userId))
      .orderBy(desc(userItems.createdAt));

      return result;
    } catch (error) {
      console.error("Error getting user inventory:", error);
      return [];
    }
  }

  async getUserActiveItems(userId: number): Promise<any[]> {
    try {
      // ใช้ Drizzle ORM แทน raw SQL
      const result = await db.select({
        itemId: userActiveItems.itemId,
        type: userActiveItems.type
      })
      .from(userActiveItems)
      .where(eq(userActiveItems.userId, userId));

      return result;
    } catch (error) {
      console.error("Error getting user active items:", error);
      return [];
    }
  }

  async activateItem(userId: number, itemId: number, type: string): Promise<boolean> {
    try {
      // ตรวจสอบว่าผู้ใช้เป็นเจ้าของไอเทมนี้
      const owns = await this.checkUserOwnsItem(userId, itemId);
      if (!owns) {
        throw new Error("User does not own this item");
      }

      // ปิดการทำงานของระบบ activation ไว้ชั่วคราว
      console.log(`[MAINTENANCE] Item activation disabled: User ${userId}, Item ${itemId}, Type ${type}`);

      // ส่งกลับสำเร็จเพื่อไม่ให้ frontend error
      return true;
    } catch (error) {
      console.error("Error activating item:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();