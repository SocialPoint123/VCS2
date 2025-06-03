import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  status: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthUser {
  user: User;
  sessionId?: string;
}

/**
 * Hook สำหรับจัดการ authentication state
 * รองรับการเข้าสู่ระบบ ออกจากระบบ และตรวจสอบสถานะ
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ดึงข้อมูล user ปัจจุบันจาก localStorage และ server
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      // ตรวจสอบ localStorage ก่อน
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        return null;
      }

      try {
        const parsedUser = JSON.parse(stored);
        
        // ถ้ามี sessionId ให้ตรวจสอบกับ server
        if (parsedUser.sessionId) {
          const serverUser = await apiRequest("/api/auth/me");
          return serverUser;
        }
        
        // ถ้าไม่มี sessionId ให้ใช้ข้อมูลจาก localStorage
        return parsedUser;
      } catch (error) {
        // ถ้า server ตอบว่า unauthorized ให้ลบ localStorage
        localStorage.removeItem("currentUser");
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache เป็นเวลา 5 นาที
  });

  // ฟังก์ชันออกจากระบบ
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      // ลบข้อมูลจาก localStorage
      localStorage.removeItem("currentUser");
      
      // Clear cache
      queryClient.clear();
      
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "ขอบคุณที่ใช้บริการ",
      });

      // รีเฟรชหน้าเพื่อไปที่หน้า login
      window.location.href = "/login";
    },
    onError: (error: any) => {
      // แม้ logout ผิดพลาดก็ให้ลบข้อมูล local ออกเพื่อบังคับ logout
      localStorage.removeItem("currentUser");
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: currentUser?.user,
    isLoading,
    isAuthenticated: !!currentUser?.user,
    error,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}

/**
 * Hook สำหรับตรวจสอบสิทธิ์แอดมิน
 */
export function useAdminAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
  };
}