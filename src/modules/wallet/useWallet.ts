import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService, type TransferRequest, type TopUpRequest, type WithdrawRequest } from "./walletService";
import { useToast } from "../hooks/use-toast";

/**
 * Custom hooks สำหรับระบบกระเป๋าเงิน
 * รองรับการดึงข้อมูล ธุรกรรม และการโอนเครดิต
 */

// Hook สำหรับดึงข้อมูลกระเป๋าเงิน
export function useWallet(userId: number) {
  return useQuery({
    queryKey: ["/api/wallet", userId],
    queryFn: () => walletService.getWallet(userId),
    staleTime: 30 * 1000, // Cache เป็นเวลา 30 วินาที
  });
}

// Hook สำหรับดึงประวัติธุรกรรม
export function useTransactionHistory(userId: number) {
  return useQuery({
    queryKey: ["/api/wallet", userId, "transactions"],
    queryFn: () => walletService.getTransactionHistory(userId),
    staleTime: 15 * 1000, // Cache เป็นเวลา 15 วินาที
  });
}

// Hook สำหรับโอนเครดิต
export function useTransferCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (transferData: TransferRequest) => walletService.transferCredits(transferData),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลกระเป๋าเงินและประวัติธุรกรรม
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.fromUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.toUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.fromUserId, "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.toUserId, "transactions"] });
      
      // รีเฟรชข้อมูลโปรไฟล์
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });

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

// Hook สำหรับขอเติมเครดิต
export function useTopUpRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (topUpData: TopUpRequest) => walletService.requestTopUp(topUpData),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลธุรกรรม
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.userId, "transactions"] });

      toast({
        title: "ส่งคำขอเติมเครดิตแล้ว",
        description: data.message || "รอการอนุมัติจากผู้ดูแลระบบ",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถส่งคำขอได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับขอถอนเครดิต
export function useWithdrawRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (withdrawData: WithdrawRequest) => walletService.requestWithdraw(withdrawData),
    onSuccess: (data, variables) => {
      // รีเฟรชข้อมูลธุรกรรม
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", variables.userId, "transactions"] });

      toast({
        title: "ส่งคำขอถอนเครดิตแล้ว",
        description: data.message || "รอการอนุมัติจากผู้ดูแลระบบ",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถส่งคำขอได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับค้นหาผู้ใช้
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["/api/users/search", query],
    queryFn: () => walletService.searchUsers(query),
    enabled: query.length >= 2, // เริ่มค้นหาเมื่อมีอักขระ 2 ตัวขึ้นไป
    staleTime: 60 * 1000, // Cache เป็นเวลา 1 นาที
  });
}