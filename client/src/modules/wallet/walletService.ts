export interface WalletInfo {
  id: number;
  userId: number;
  balance: string;
  createdAt: string;
}

export interface CreditTransaction {
  id: number;
  fromUserId?: number;
  toUserId?: number;
  amount: string;
  type: string;
  status: string;
  note?: string;
  balanceAfter: string;
  createdAt: string;
  fromUser?: {
    id: number;
    name: string;
    username: string;
  };
  toUser?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface TransferRequest {
  fromUserId: number;
  toUserId: number;
  amount: string;
  note?: string;
}

export interface TopUpRequest {
  userId: number;
  amount: string;
  note?: string;
}

export interface WithdrawRequest {
  userId: number;
  amount: string;
  note?: string;
}

/**
 * บริการจัดการกระเป๋าเงินและธุรกรรมเครดิต
 * รองรับการเติม ถอน โอน และดูประวัติ
 */
export const walletService = {
  // ดึงข้อมูลกระเป๋าเงิน
  async getWallet(userId: number): Promise<WalletInfo> {
    const response = await fetch(`/api/wallet/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch wallet info");
    }

    return response.json();
  },

  // ดึงประวัติธุรกรรม
  async getTransactionHistory(userId: number): Promise<CreditTransaction[]> {
    const response = await fetch(`/api/wallet/${userId}/transactions`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transaction history");
    }

    return response.json();
  },

  // โอนเครดิต
  async transferCredits(transferData: TransferRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to transfer credits");
    }

    return response.json();
  },

  // ขอเติมเครดิต (ต้องรอ admin อนุมัติ)
  async requestTopUp(topUpData: TopUpRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/wallet/top-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topUpData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to request top-up");
    }

    return response.json();
  },

  // ขอถอนเครดิต (ต้องรอ admin อนุมัติ)
  async requestWithdraw(withdrawData: WithdrawRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/wallet/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(withdrawData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to request withdrawal");
    }

    return response.json();
  },

  // ค้นหาผู้ใช้สำหรับโอนเครดิต
  async searchUsers(query: string): Promise<Array<{ id: number; name: string; username: string }>> {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to search users");
    }

    return response.json();
  },
};