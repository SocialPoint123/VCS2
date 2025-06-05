export interface Pet {
  id: number;
  userId: number;
  type: string;
  name: string;
  energy: number;
  mood: number;
  level: number;
  experience: number;
  lastCollectedAt: string;
  lastFedAt: string;
  lastPlayedAt: string;
  createdAt: string;
}

export interface PetAction {
  userId: number;
  action: 'feed' | 'play' | 'collect';
}

export interface PetStats {
  energy: number;
  mood: number;
  level: number;
  experience: number;
  experienceToNext: number;
  canCollect: boolean;
  collectAmount: number;
  hoursUntilCollect: number;
}

/**
 * บริการจัดการสัตว์เลี้ยงและการดำเนินการต่างๆ
 * รองรับการให้อาหาร เล่น และเก็บเกี่ยวเครดิต
 */
export const petService = {
  // ดึงข้อมูลสัตว์เลี้ยงของผู้ใช้
  async getUserPet(userId: number): Promise<Pet | null> {
    const response = await fetch(`/api/pet/${userId}`, {
      method: "GET",
    });

    if (response.status === 404) {
      return null; // ยังไม่มีสัตว์เลี้ยง
    }

    if (!response.ok) {
      throw new Error("Failed to fetch pet data");
    }

    return response.json();
  },

  // สร้างสัตว์เลี้ยงใหม่
  async createPet(userId: number, type: string, name: string): Promise<Pet> {
    const response = await fetch("/api/pet/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, type, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create pet");
    }

    return response.json();
  },

  // ดำเนินการกับสัตว์เลี้ยง (ให้อาหาร, เล่น, เก็บเกี่ยว)
  async performAction(action: PetAction): Promise<{ success: boolean; message: string; pet?: Pet; reward?: number }> {
    const response = await fetch("/api/pet/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to perform action");
    }

    return response.json();
  },

  // ดึงสถิติสัตว์เลี้ยง
  async getPetStats(userId: number): Promise<PetStats> {
    const response = await fetch(`/api/pet/${userId}/stats`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pet stats");
    }

    return response.json();
  },

  // เปลี่ยนชื่อสัตว์เลี้ยง
  async renamePet(userId: number, newName: string): Promise<Pet> {
    const response = await fetch("/api/pet/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, name: newName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to rename pet");
    }

    return response.json();
  },

  // คำนวณเวลาที่เหลือจนถึงการเก็บเกี่ยวครั้งถัดไป
  calculateTimeUntilCollect(lastCollectedAt: string): { canCollect: boolean; hoursRemaining: number } {
    const now = new Date();
    const lastCollected = new Date(lastCollectedAt);
    const hoursSinceCollect = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);
    const collectInterval = 4; // ทุก 4 ชั่วโมง
    
    const canCollect = hoursSinceCollect >= collectInterval;
    const hoursRemaining = canCollect ? 0 : collectInterval - hoursSinceCollect;
    
    return { canCollect, hoursRemaining };
  },

  // คำนวณจำนวนเครดิตที่จะได้รับ
  calculateCollectAmount(level: number, mood: number, energy: number): number {
    const baseAmount = 10; // เครดิตพื้นฐาน
    const levelBonus = (level - 1) * 5; // โบนัสจากเลเวล
    const moodMultiplier = mood / 100; // ตัวคูณจากอารมณ์
    const energyMultiplier = energy / 100; // ตัวคูณจากพลังงาน
    
    return Math.floor((baseAmount + levelBonus) * moodMultiplier * energyMultiplier);
  },

  // คำนวณ Experience ที่ต้องการสำหรับเลเวลถัดไป
  calculateExperienceToNext(level: number, currentExp: number): number {
    const expRequired = level * 100; // เลเวล 1 ต้องการ 100 exp, เลเวล 2 ต้องการ 200 exp
    return Math.max(0, expRequired - currentExp);
  },
};