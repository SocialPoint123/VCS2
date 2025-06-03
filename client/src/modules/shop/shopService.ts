export interface ShopItem {
  id: number;
  name: string;
  type: string;
  price: string;
  rarity: string;
  description?: string;
  mediaUrl?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface UserItem {
  id: number;
  userId: number;
  itemId: number;
  createdAt: string;
  item: ShopItem;
}

export interface PurchaseRequest {
  userId: number;
  itemId: number;
}

/**
 * บริการจัดการร้านค้าและไอเทม
 * รองรับการดูไอเทม ซื้อไอเทม และจัดการคอลเลคชัน
 */
export const shopService = {
  // ดึงไอเทมทั้งหมดในร้านค้า
  async getAllItems(): Promise<ShopItem[]> {
    const response = await fetch("/api/shop/items", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shop items");
    }

    return response.json();
  },

  // ดึงไอเทมตามประเภท
  async getItemsByType(type: string): Promise<ShopItem[]> {
    const response = await fetch(`/api/shop/items?type=${encodeURIComponent(type)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch items by type");
    }

    return response.json();
  },

  // ดึงไอเทมตามความหายาก
  async getItemsByRarity(rarity: string): Promise<ShopItem[]> {
    const response = await fetch(`/api/shop/items?rarity=${encodeURIComponent(rarity)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch items by rarity");
    }

    return response.json();
  },

  // ซื้อไอเทม
  async purchaseItem(purchaseData: PurchaseRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to purchase item");
    }

    return response.json();
  },

  // ดึงไอเทมของผู้ใช้
  async getUserItems(userId: number): Promise<UserItem[]> {
    const response = await fetch(`/api/shop/user-items/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user items");
    }

    return response.json();
  },

  // ตรวจสอบว่าผู้ใช้มีไอเทมนี้แล้วหรือไม่
  async checkUserOwnsItem(userId: number, itemId: number): Promise<boolean> {
    const response = await fetch(`/api/shop/user-items/${userId}/check/${itemId}`, {
      method: "GET",
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.owns;
  },

  // ดึงข้อมูลไอเทมเดี่ยว
  async getItemById(itemId: number): Promise<ShopItem> {
    const response = await fetch(`/api/shop/items/${itemId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch item details");
    }

    return response.json();
  },
};