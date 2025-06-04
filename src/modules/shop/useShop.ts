import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService, type PurchaseRequest, type ShopItem, type UserItem } from "./shopService";
import { useToast } from "../../hooks/use-toast";

/**
 * Custom hooks สำหรับระบบร้านค้า
 * รองรับการดึงข้อมูล ซื้อไอเทม และจัดการคอลเลคชัน
 */

// Hook สำหรับดึงไอเทมทั้งหมด
export function useShopItems() {
  return useQuery({
    queryKey: ["/api/shop/items"],
    queryFn: () => shopService.getAllItems(),
    staleTime: 5 * 60 * 1000, // Cache เป็นเวลา 5 นาที
  });
}

// Hook สำหรับดึงไอเทมตามประเภท
export function useShopItemsByType(type: string) {
  return useQuery({
    queryKey: ["/api/shop/items", "type", type],
    queryFn: () => shopService.getItemsByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook สำหรับดึงไอเทมตามความหายาก
export function useShopItemsByRarity(rarity: string) {
  return useQuery({
    queryKey: ["/api/shop/items", "rarity", rarity],
    queryFn: () => shopService.getItemsByRarity(rarity),
    enabled: !!rarity,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook สำหรับดึงไอเทมของผู้ใช้
export function useUserItems(userId: number) {
  return useQuery({
    queryKey: ["/api/shop/user-items", userId],
    queryFn: () => shopService.getUserItems(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // Cache เป็นเวลา 2 นาที
  });
}

// Hook สำหรับตรวจสอบความเป็นเจ้าของไอเทม
export function useCheckItemOwnership(userId: number, itemId: number) {
  return useQuery({
    queryKey: ["/api/shop/user-items", userId, "check", itemId],
    queryFn: () => shopService.checkUserOwnsItem(userId, itemId),
    enabled: !!userId && !!itemId,
    staleTime: 2 * 60 * 1000,
  });
}

// Hook สำหรับดึงข้อมูลไอเทมเดี่ยว
export function useShopItem(itemId: number) {
  return useQuery({
    queryKey: ["/api/shop/items", itemId],
    queryFn: () => shopService.getItemById(itemId),
    enabled: !!itemId,
    staleTime: 10 * 60 * 1000, // Cache เป็นเวลา 10 นาที
  });
}

// Hook สำหรับซื้อไอเทม
export function usePurchaseItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (purchaseData: PurchaseRequest) => shopService.purchaseItem(purchaseData),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลไอเทมของผู้ใช้
      queryClient.invalidateQueries({ queryKey: ["/api/shop/user-items", variables.userId] });
      
      // รีเฟรชข้อมูลการตรวจสอบความเป็นเจ้าของ
      queryClient.invalidateQueries({ 
        queryKey: ["/api/shop/user-items", variables.userId, "check", variables.itemId] 
      });
      
      // รีเฟรชข้อมูลกระเป๋าเงิน
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.userId, "transactions"] });

      toast({
        title: "ซื้อไอเทมสำเร็จ",
        description: data.message || "ไอเทมถูกเพิ่มในคอลเลคชันของคุณแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถซื้อไอเทมได้",
        variant: "destructive",
      });
    },
  });
}