import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

// ประเภทข้อมูลผู้ใช้งาน
export interface User {
  id: number;                    // รหัสผู้ใช้
  username: string;              // ชื่อผู้ใช้
  email: string;                 // อีเมล
  name: string;                  // ชื่อ-นามสกุล
  status: string;                // สถานะ (active, suspended, banned)
  isAdmin: boolean;              // สิทธิ์แอดมิน
  createdAt: string;             // วันที่สร้างบัญชี
}

// ประเภทข้อมูลผู้ใช้ที่มี session
export interface AuthUser {
  user: User;                    // ข้อมูลผู้ใช้
  sessionId?: string;            // รหัส session (ถ้ามี)
}

/**
 * Hook สำหรับจัดการสถานะการยืนยันตัวตน
 * รองรับการเข้าสู่ระบบ ออกจากระบบ และตรวจสอบสถานะการล็อกอิน
 * ใช้ localStorage และ server validation เพื่อความปลอดภัย
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ดึงข้อมูลผู้ใช้ปัจจุบันจาก localStorage และตรวจสอบกับเซิร์ฟเวอร์
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      // ตรวจสอบข้อมูลใน localStorage ก่อน
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        return null; // ไม่มีข้อมูลการล็อกอิน
      }

      try {
        const parsedUser = JSON.parse(stored);
        
        // หากมี sessionId ให้ตรวจสอบความถูกต้องกับเซิร์ฟเวอร์
        if (parsedUser.sessionId) {
          const serverUser = await apiRequest("/api/auth/me");
          return serverUser; // ส่งคืนข้อมูลจากเซิร์ฟเวอร์
        }
        
        // หากไม่มี sessionId ให้ใช้ข้อมูลที่เก็บไว้ใน localStorage
        return parsedUser;
      } catch (error) {
        // หากเซิร์ฟเวอร์ตอบว่า unauthorized ให้ลบข้อมูลออกจาก localStorage
        localStorage.removeItem("currentUser");
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // เก็บข้อมูลในแคชเป็นเวลา 5 นาที
  });

  // ฟังก์ชันสำหรับออกจากระบบ
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // ส่งคำขอออกจากระบบไปยังเซิร์ฟเวอร์
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      // ลบข้อมูลผู้ใช้ออกจาก localStorage
      localStorage.removeItem("currentUser");
      
      // ล้างข้อมูลแคชทั้งหมด
      queryClient.clear();
      
      // แสดงข้อความยืนยันการออกจากระบบ
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "ขอบคุณที่ใช้บริการ",
      });

      // เปลี่ยนเส้นทางไปหน้าล็อกอิน
      window.location.href = "/login";
    },
    onError: (error: any) => {
      // แม้การออกจากระบบผิดพลาด ก็ให้ลบข้อมูลท้องถิ่นเพื่อบังคับออกจากระบบ
      localStorage.removeItem("currentUser");
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  // ฟังก์ชันเรียกใช้การออกจากระบบ
  const logout = () => {
    logoutMutation.mutate();
  };

  // ส่งคืนข้อมูลและฟังก์ชันที่จำเป็น
  return {
    user: currentUser?.user,           // ข้อมูลผู้ใช้ปัจจุบัน
    isLoading,                         // สถานะการโหลดข้อมูล
    isAuthenticated: !!currentUser?.user, // สถานะการล็อกอิน
    error,                             // ข้อผิดพลาด (ถ้ามี)
    logout,                            // ฟังก์ชันออกจากระบบ
    isLoggingOut: logoutMutation.isPending, // สถานะการออกจากระบบ
  };
}

/**
 * Hook สำหรับตรวจสอบสิทธิ์ผู้ดูแลระบบ
 * ใช้ข้อมูลจาก useAuth และเพิ่มการตรวจสอบสิทธิ์แอดมิน
 */
export function useAdminAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    user,                                    // ข้อมูลผู้ใช้
    isLoading,                              // สถานะการโหลด
    isAuthenticated,                        // สถานะการล็อกอิน
    isAdmin: user?.isAdmin || false,        // สิทธิ์ผู้ดูแลระบบ
  };
}