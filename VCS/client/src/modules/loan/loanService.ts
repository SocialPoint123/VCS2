import { apiRequest } from "@/lib/queryClient";

export interface LoanRequest {
  id: number;
  userId: number;
  amount: string;
  interestRate: string;
  totalAmount: string;
  status: string;
  dueDate: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  note: string | null;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

export interface CreateLoanRequest {
  userId: number;
  amount: string;
  interestRate: string;
  totalAmount: string;
  dueDate?: string;
}

export interface LoanEligibility {
  eligible: boolean;
}

/**
 * บริการจัดการคำขอสินเชื่อ
 * รองรับการสร้าง ดู และอัปเดตสถานะคำขอสินเชื่อ
 */
export const loanService = {
  // สร้างคำขอสินเชื่อใหม่
  async createLoanRequest(loanData: CreateLoanRequest): Promise<LoanRequest> {
    const response = await fetch("/api/loans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || "Failed to create loan request");
    }

    return response.json();
  },

  // ดึงคำขอสินเชื่อของผู้ใช้
  async getUserLoanRequests(userId: number): Promise<LoanRequest[]> {
    const response = await fetch(`/api/loans/user/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user loan requests");
    }

    return response.json();
  },

  // ดึงคำขอสินเชื่อทั้งหมด (สำหรับแอดมิน)
  async getAllLoanRequests(): Promise<LoanRequest[]> {
    const response = await fetch("/api/loans", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch loan requests");
    }

    return response.json();
  },

  // อัปเดตสถานะคำขอสินเชื่อ
  async updateLoanStatus(loanId: number, status: string, note?: string): Promise<LoanRequest> {
    const response = await fetch(`/api/loans/${loanId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, note }),
    });

    if (!response.ok) {
      throw new Error("Failed to update loan status");
    }

    return response.json();
  },

  // ตรวจสอบสิทธิ์การขอสินเชื่อ
  async checkEligibility(userId: number): Promise<LoanEligibility> {
    const response = await fetch(`/api/loans/eligibility/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to check loan eligibility");
    }

    return response.json();
  },

  // คำนวณดอกเบี้ยรายชั่วโมง
  calculateInterest(amount: number, interestRatePerHour: number, hours: number = 24): number {
    const interest = (amount * interestRatePerHour * hours) / 100;
    return Math.round(interest * 100) / 100;
  },

  // คำนวณยอดรวมที่ต้องชำระ
  calculateTotalAmount(amount: number, interestRatePerHour: number, hours: number = 24): number {
    const interest = this.calculateInterest(amount, interestRatePerHour, hours);
    return amount + interest;
  },
};