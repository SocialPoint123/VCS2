import { users, loginLogs, creditWallets, creditTransactions, type User, type InsertUser, type LoginLog, type InsertLoginLog, type CreditWallet, type InsertCreditWallet, type CreditTransaction, type InsertCreditTransaction } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, or, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, status: string): Promise<User | undefined>;

  // Admin specific
  getDashboardStats(): Promise<{
    totalUsers: number;
    onlineUsers: number;
    totalCredits: string;
    todayTransactions: number;
  }>;

  // Login logs
  createLoginLog(log: InsertLoginLog): Promise<LoginLog>;
  getUserLoginLogs(userId: number): Promise<LoginLog[]>;

  // Credit wallets
  getUserWallet(userId: number): Promise<CreditWallet | undefined>;
  createUserWallet(wallet: InsertCreditWallet): Promise<CreditWallet>;
  updateWalletBalance(userId: number, balance: string): Promise<CreditWallet | undefined>;

  // Credit transactions
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserCreditTransactions(userId: number): Promise<CreditTransaction[]>;
  getAllCreditTransactions(): Promise<CreditTransaction[]>;
}

// Database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export class DatabaseStorage implements IStorage {
  async initializeData() {
    // Check if admin user exists, if not create sample data
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
}

export const storage = new DatabaseStorage();
