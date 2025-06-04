import { apiRequest } from "../lib/queryClient";

export interface ChatMessage {
  id: number;
  fromUserId: number;
  toUserId: number | null;
  roomId: string | null;
  message: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  fromUser: {
    id: number;
    name: string;
    username: string;
  } | null;
  toUser?: {
    id: number;
    name: string;
    username: string;
  } | null;
}

export interface SendMessageData {
  fromUserId: number;
  toUserId?: number;
  roomId?: string;
  message: string;
  messageType?: string;
}

/**
 * บริการจัดการแชทและข้อความ
 * รองรับทั้งแชทส่วนตัวและโถงแชทสาธารณะ
 */
export const chatService = {
  // ส่งข้อความใหม่
  async sendMessage(messageData: SendMessageData): Promise<ChatMessage> {
    const response = await apiRequest("/api/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
    return response;
  },

  // ดึงข้อความแชทส่วนตัว
  async getPrivateMessages(userId1: number, userId2: number): Promise<ChatMessage[]> {
    const response = await apiRequest(`/api/messages/private/${userId1}/${userId2}`, {
      method: "GET",
    });
    return response;
  },

  // ดึงข้อความโถงแชทสาธารณะ
  async getPublicMessages(roomId: string): Promise<ChatMessage[]> {
    const response = await apiRequest(`/api/messages/public/${roomId}`, {
      method: "GET",
    });
    return response;
  },

  // ทำเครื่องหมายข้อความว่าอ่านแล้ว
  async markMessageAsRead(messageId: number): Promise<{ success: boolean }> {
    const response = await apiRequest(`/api/messages/${messageId}/read`, {
      method: "PATCH",
    });
    return response;
  },

  // นับข้อความที่ยังไม่ได้อ่าน
  async getUnreadMessageCount(userId: number): Promise<{ unreadCount: number }> {
    const response = await apiRequest(`/api/messages/unread/${userId}`, {
      method: "GET",
    });
    return response;
  },
};