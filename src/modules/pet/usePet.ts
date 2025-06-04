import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petService, type Pet, type PetAction, type PetStats } from "./petService";
import { useToast } from "../hooks/use-toast";

/**
 * Custom hooks สำหรับระบบสัตว์เลี้ยง
 * รองรับการดึงข้อมูล ดำเนินการ และจัดการสัตว์เลี้ยง
 */

// Hook สำหรับดึงข้อมูลสัตว์เลี้ยงของผู้ใช้
export function useUserPet(userId: number) {
  return useQuery({
    queryKey: ["/api/pet", userId],
    queryFn: () => petService.getUserPet(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // Cache เป็นเวลา 30 วินาที
  });
}

// Hook สำหรับดึงสถิติสัตว์เลี้ยง
export function usePetStats(userId: number) {
  return useQuery({
    queryKey: ["/api/pet", userId, "stats"],
    queryFn: () => petService.getPetStats(userId),
    enabled: !!userId,
    staleTime: 15 * 1000, // Cache เป็นเวลา 15 วินาที
    refetchInterval: 60 * 1000, // รีเฟรชทุก 1 นาที
  });
}

// Hook สำหรับสร้างสัตว์เลี้ยงใหม่
export function useCreatePet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, type, name }: { userId: number; type: string; name: string }) => 
      petService.createPet(userId, type, name),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลสัตว์เลี้ยง
      queryClient.invalidateQueries({ queryKey: ["/api/pet", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/pet", variables.userId, "stats"] });

      toast({
        title: "สร้างสัตว์เลี้ยงสำเร็จ",
        description: `ยินดีต้อนรับ ${data.name} สู่ครอบครัว!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถสร้างสัตว์เลี้ยงได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับดำเนินการกับสัตว์เลี้ยง
export function usePetAction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (action: PetAction) => petService.performAction(action),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลสัตว์เลี้ยงและสถิติ
      queryClient.invalidateQueries({ queryKey: ["/api/pet", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/pet", variables.userId, "stats"] });
      
      // รีเฟรชข้อมูลกระเป๋าเงินถ้าได้รับเครดิต
      if (variables.action === 'collect' && data.reward) {
        queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.userId] });
        queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.userId, "transactions"] });
      }

      // แสดงข้อความตามการดำเนินการ
      let title = "";
      let description = data.message;

      switch (variables.action) {
        case 'feed':
          title = "ให้อาหารสำเร็จ";
          break;
        case 'play':
          title = "เล่นกับสัตว์เลี้ยงสำเร็จ";
          break;
        case 'collect':
          title = "เก็บเกี่ยวสำเร็จ";
          if (data.reward) {
            description += ` ได้รับ ${data.reward} เครดิต!`;
          }
          break;
      }

      toast({
        title,
        description,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถดำเนินการได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับเปลี่ยนชื่อสัตว์เลี้ยง
export function useRenamePet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, name }: { userId: number; name: string }) => 
      petService.renamePet(userId, name),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลสัตว์เลี้ยง
      queryClient.invalidateQueries({ queryKey: ["/api/pet", variables.userId] });

      toast({
        title: "เปลี่ยนชื่อสำเร็จ",
        description: `เปลี่ยนชื่อเป็น "${data.name}" แล้ว`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถเปลี่ยนชื่อได้",
        variant: "destructive",
      });
    },
  });
}