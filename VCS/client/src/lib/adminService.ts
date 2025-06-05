import { apiRequest } from "./queryClient";

export interface DashboardStats {
  totalUsers: number;
  onlineUsers: number;
  totalCredits: string;
  todayTransactions: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
  creditBalance: string;
}

export interface LoginLog {
  id: number;
  userId: number;
  ip: string;
  userAgent: string;
  fingerprint: string;
  status: string;
  timestamp: string;
}

export interface CreditTransaction {
  id: number;
  fromUserId: number | null;
  toUserId: number | null;
  amount: string;
  type: string;
  status: string;
  note: string;
  balanceAfter: string;
  createdAt: string;
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiRequest("GET", "/api/admin/dashboard-stats");
    return response.json();
  },

  async getUsers(): Promise<User[]> {
    const response = await apiRequest("GET", "/api/admin/users");
    return response.json();
  },

  async getUserLoginLogs(userId: number): Promise<LoginLog[]> {
    const response = await apiRequest("GET", `/api/admin/users/${userId}/login-logs`);
    return response.json();
  },

  async getUserCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    const response = await apiRequest("GET", `/api/admin/users/${userId}/credit-transactions`);
    return response.json();
  },

  async updateUserStatus(userId: number, status: string): Promise<User> {
    const response = await apiRequest("PATCH", `/api/admin/users/${userId}/status`, { status });
    return response.json();
  },

  async checkAdminAuth(): Promise<{ isAdmin: boolean; user: any }> {
    const response = await apiRequest("GET", "/api/admin/auth");
    return response.json();
  },
};
