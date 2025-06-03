import { users, loginLogs, creditWallets, creditTransactions, type User, type InsertUser, type LoginLog, type InsertLoginLog, type CreditWallet, type InsertCreditWallet, type CreditTransaction, type InsertCreditTransaction } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private loginLogs: Map<number, LoginLog>;
  private creditWallets: Map<number, CreditWallet>;
  private creditTransactions: Map<number, CreditTransaction>;
  private currentUserId: number;
  private currentLoginLogId: number;
  private currentWalletId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.loginLogs = new Map();
    this.creditWallets = new Map();
    this.creditTransactions = new Map();
    this.currentUserId = 1;
    this.currentLoginLogId = 1;
    this.currentWalletId = 1;
    this.currentTransactionId = 1;

    // Create admin user
    this.createUser({
      username: "admin",
      email: "admin@bergdotbet.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      status: "active"
    });

    // Create sample users
    this.createUser({
      username: "somchai123",
      email: "somchai@example.com",
      password: "password123",
      name: "สมชาย ใจดี",
      role: "user",
      status: "active"
    });

    this.createUser({
      username: "somying456",
      email: "somying@example.com",
      password: "password123",
      name: "สมหญิง รักเงิน",
      role: "user",
      status: "active"
    });

    this.createUser({
      username: "thanakorn789",
      email: "thanakorn@example.com",
      password: "password123",
      name: "ธนกร นักเล่น",
      role: "user",
      status: "suspended"
    });

    // Create wallets for users
    this.createUserWallet({ userId: 2, balance: "1247.50" });
    this.createUserWallet({ userId: 3, balance: "2847.25" });
    this.createUserWallet({ userId: 4, balance: "156.75" });

    // Create sample login logs
    this.createLoginLog({
      userId: 2,
      ip: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      fingerprint: "a1b2c3d4e5f6",
      status: "success"
    });

    this.createLoginLog({
      userId: 2,
      ip: "192.168.1.105",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
      fingerprint: "m1n2o3p4q5r6",
      status: "success"
    });

    this.createLoginLog({
      userId: 2,
      ip: "203.154.62.47",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      fingerprint: "x1y2z3a4b5c6",
      status: "failure"
    });

    // Create sample transactions
    this.createCreditTransaction({
      toUserId: 2,
      amount: "500.00",
      type: "deposit",
      status: "completed",
      note: "ฝากเงินผ่านธนาคาร",
      balanceAfter: "1247.50"
    });

    this.createCreditTransaction({
      fromUserId: 2,
      amount: "150.00",
      type: "game_loss",
      status: "completed",
      note: "แพ้เกมบาคาร่า รอบที่ 15",
      balanceAfter: "747.50"
    });

    this.createCreditTransaction({
      toUserId: 2,
      amount: "50.00",
      type: "bonus",
      status: "completed",
      note: "โบนัสสมาชิกใหม่",
      balanceAfter: "897.50"
    });

    this.createCreditTransaction({
      toUserId: 2,
      amount: "300.00",
      type: "game_win",
      status: "completed",
      note: "ชนะ Jackpot เกมสล็อต",
      balanceAfter: "847.50"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserStatus(id: number, status: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, status };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    onlineUsers: number;
    totalCredits: string;
    todayTransactions: number;
  }> {
    const totalUsers = this.users.size;
    const onlineUsers = Math.floor(totalUsers * 0.4); // Mock online users as 40% of total
    
    const wallets = Array.from(this.creditWallets.values());
    const totalCredits = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0).toFixed(2);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = Array.from(this.creditTransactions.values())
      .filter(tx => tx.createdAt >= today).length;

    return {
      totalUsers,
      onlineUsers,
      totalCredits,
      todayTransactions
    };
  }

  async createLoginLog(log: InsertLoginLog): Promise<LoginLog> {
    const id = this.currentLoginLogId++;
    const loginLog: LoginLog = {
      ...log,
      id,
      timestamp: new Date()
    };
    this.loginLogs.set(id, loginLog);
    return loginLog;
  }

  async getUserLoginLogs(userId: number): Promise<LoginLog[]> {
    return Array.from(this.loginLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getUserWallet(userId: number): Promise<CreditWallet | undefined> {
    return Array.from(this.creditWallets.values()).find(wallet => wallet.userId === userId);
  }

  async createUserWallet(wallet: InsertCreditWallet): Promise<CreditWallet> {
    const id = this.currentWalletId++;
    const creditWallet: CreditWallet = {
      ...wallet,
      id,
      updatedAt: new Date()
    };
    this.creditWallets.set(id, creditWallet);
    return creditWallet;
  }

  async updateWalletBalance(userId: number, balance: string): Promise<CreditWallet | undefined> {
    const wallet = Array.from(this.creditWallets.values()).find(w => w.userId === userId);
    if (wallet) {
      const updatedWallet = { ...wallet, balance, updatedAt: new Date() };
      this.creditWallets.set(wallet.id, updatedWallet);
      return updatedWallet;
    }
    return undefined;
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const id = this.currentTransactionId++;
    const creditTransaction: CreditTransaction = {
      ...transaction,
      id,
      createdAt: new Date()
    };
    this.creditTransactions.set(id, creditTransaction);
    return creditTransaction;
  }

  async getUserCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    return Array.from(this.creditTransactions.values())
      .filter(tx => tx.fromUserId === userId || tx.toUserId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllCreditTransactions(): Promise<CreditTransaction[]> {
    return Array.from(this.creditTransactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
