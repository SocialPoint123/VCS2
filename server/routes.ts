import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/admin/dashboard-stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Get all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
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

  // Get user login logs
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

  // Get user credit transactions
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

  // Update user status
  app.patch("/api/admin/users/:userId/status", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { status } = req.body;

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

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

  // Check admin authentication
  app.get("/api/admin/auth", async (req, res) => {
    try {
      // Mock admin authentication - in real implementation, check session/token
      res.json({ isAdmin: true, user: { id: 1, name: "Admin User", email: "admin@bergdotbet.com" } });
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
