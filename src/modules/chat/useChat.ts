import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService, type SendMessageData, type ChatMessage } from "./chatService";
import { useToast } from "../hooks/use-toast";

/**
 * Custom hooks สำหรับระบบแชท
 * รองรับการดึงข้อความ ส่งข้อความ และจัดการสถานะการอ่าน
 */

// Hook สำหรับดึงข้อความแชทส่วนตัว
export function usePrivateMessages(userId1: number, userId2: number) {
  return useQuery({
    queryKey: ["/api/messages/private", userId1, userId2],
    queryFn: () => chatService.getPrivateMessages(userId1, userId2),
    refetchInterval: 3000, // รีเฟรชทุก 3 วินาที
    staleTime: 1000, // ข้อมูลเก่าหลังจาก 1 วินาที
  });
}

// Hook สำหรับดึงข้อความโถงแชทสาธารณะ
export function usePublicMessages(roomId: string) {
  return useQuery({
    queryKey: ["/api/messages/public", roomId],
    queryFn: () => chatService.getPublicMessages(roomId),
    refetchInterval: 2000, // รีเฟรชทุก 2 วินาที
    staleTime: 500, // ข้อมูลเก่าหลังจาก 0.5 วินาที
  });
}

// Hook สำหรับส่งข้อความ
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (messageData: SendMessageData) => chatService.sendMessage(messageData),
    onSuccess: (newMessage: ChatMessage) => {
      // อัปเดต cache สำหรับแชทส่วนตัว
      if (newMessage.toUserId) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/messages/private", newMessage.fromUserId, newMessage.toUserId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ["/api/messages/private", newMessage.toUserId, newMessage.fromUserId] 
        });
      }
      
      // อัปเดต cache สำหรับโถงแชทสาธารณะ
      if (newMessage.roomId) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/messages/public", newMessage.roomId] 
        });
      }
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อความได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับทำเครื่องหมายข้อความว่าอ่านแล้ว
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => chatService.markMessageAsRead(messageId),
    onSuccess: () => {
      // รีเฟรชข้อมูลข้อความที่ยังไม่ได้อ่าน
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread"] });
    },
  });
}

// Hook สำหรับนับข้อความที่ยังไม่ได้อ่าน
export function useUnreadMessageCount(userId: number) {
  return useQuery({
    queryKey: ["/api/messages/unread", userId],
    queryFn: () => chatService.getUnreadMessageCount(userId),
    refetchInterval: 5000, // รีเฟรชทุก 5 วินาที
  });
}