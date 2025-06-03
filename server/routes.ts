import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

/**
 * ลงทะเบียน API routes สำหรับระบบแอดมิน
 * ครอบคลุมการจัดการผู้ใช้ สถิติ ประวัติล็อกอิน และธุรกรรมเครดิต
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // API สำหรับดึงสถิติภาพรวมระบบ
  app.get("/api/admin/dashboard-stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // API สำหรับดึงรายชื่อผู้ใช้ทั้งหมดพร้อมยอดเครดิต
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // รวมข้อมูลผู้ใช้กับยอดเครดิตจากกระเป๋าเงิน
      const usersWithWallets = await Promise.all(
        users.map(async (user) => {
          const wallet = await storage.getUserWallet(user.id);
          return {
            ...user,
            creditBalance: wallet?.balance || "0.00"
          };
        })
      );
      res.json(usersWithWallets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // API สำหรับดึงประวัติการล็อกอินของผู้ใช้
  app.get("/api/admin/users/:userId/login-logs", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const logs = await storage.getUserLoginLogs(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch login logs" });
    }
  });

  // API สำหรับดึงประวัติธุรกรรมเครดิตของผู้ใช้
  app.get("/api/admin/users/:userId/credit-transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const transactions = await storage.getUserCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credit transactions" });
    }
  });

  // API สำหรับอัปเดตสถานะผู้ใช้ (ใช้งาน/ระงับ/แบน)
  app.patch("/api/admin/users/:userId/status", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { status } = req.body;

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // ตรวจสอบว่าสถานะที่ส่งมาถูกต้อง
      if (!status || !["active", "suspended", "banned"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedUser = await storage.updateUserStatus(userId, status);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // API สำหรับตรวจสอบสิทธิ์แอดมิน
  app.get("/api/admin/auth", async (req, res) => {
    try {
      // ในการใช้งานจริงควรตรวจสอบ session หรือ JWT token
      res.json({ isAdmin: true, user: { id: 1, name: "Admin User", email: "admin@bergdotbet.com" } });
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
