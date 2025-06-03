import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, type TransferCreditsData, type UserProfile, type UserPost } from "./profileService";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hooks สำหรับระบบโปรไฟล์ผู้ใช้
 * รองรับการดึงข้อมูล โพสต์ และโอนเครดิต
 */

// Hook สำหรับดึงข้อมูลโปรไฟล์ผู้ใช้
export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: ["/api/profile", userId],
    queryFn: () => profileService.getUserProfile(userId),
    staleTime: 60 * 1000, // Cache เป็นเวลา 1 นาที
  });
}

// Hook สำหรับดึงโพสต์ของผู้ใช้
export function useUserPosts(userId: number) {
  return useQuery({
    queryKey: ["/api/profile", userId, "posts"],
    queryFn: () => profileService.getUserPosts(userId),
    staleTime: 30 * 1000, // Cache เป็นเวลา 30 วินาที
  });
}

// Hook สำหรับโอนเครดิต
export function useTransferCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (transferData: TransferCreditsData) => profileService.transferCredits(transferData),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลโปรไฟล์ของผู้ส่งและผู้รับ
      queryClient.invalidateQueries({ queryKey: ["/api/profile", variables.fromUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile", variables.toUserId] });
      
      // รีเฟรชข้อมูลผู้ใช้ทั้งหมด
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });

      toast({
        title: "โอนเครดิตสำเร็จ",
        description: data.message || "โอนเครดิตเรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถโอนเครดิตได้",
        variant: "destructive",
      });
    },
  });
}