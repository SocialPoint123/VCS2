export interface UserProfile {
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    status: string;
    createdAt: string;
  };
  wallet: {
    id: number;
    userId: number;
    balance: string;
    createdAt: string;
  };
  postsCount: number;
}

export interface UserPost {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
  } | null;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
}

export interface TransferCreditsData {
  fromUserId: number;
  toUserId: number;
  amount: string;
  note?: string;
}

/**
 * บริการจัดการข้อมูลโปรไฟล์ผู้ใช้
 * รองรับการดูโปรไฟล์ โพสต์ และโอนเครดิต
 */
export const profileService = {
  // ดึงข้อมูลโปรไฟล์ผู้ใช้
  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await fetch(`/api/profile/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  },

  // ดึงโพสต์ของผู้ใช้
  async getUserPosts(userId: number): Promise<UserPost[]> {
    const response = await fetch(`/api/profile/${userId}/posts`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    return response.json();
  },

  // โอนเครดิต
  async transferCredits(transferData: TransferCreditsData): Promise<{ success: boolean; message: string }> {
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
};