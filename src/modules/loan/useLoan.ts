import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loanService, type CreateLoanRequest, type LoanRequest } from "./loanService";
import { useToast } from "../hooks/use-toast";

/**
 * Custom hooks สำหรับระบบสินเชื่อ
 * รองรับการดึงข้อมูล สร้างคำขอ และอัปเดตสถานะ
 */

// Hook สำหรับดึงคำขอสินเชื่อของผู้ใช้
export function useUserLoanRequests(userId: number) {
  return useQuery({
    queryKey: ["/api/loans/user", userId],
    queryFn: () => loanService.getUserLoanRequests(userId),
    staleTime: 30 * 1000, // Cache เป็นเวลา 30 วินาที
  });
}

// Hook สำหรับดึงคำขอสินเชื่อทั้งหมด (แอดมิน)
export function useAllLoanRequests() {
  return useQuery({
    queryKey: ["/api/loans"],
    queryFn: () => loanService.getAllLoanRequests(),
    staleTime: 10 * 1000, // Cache เป็นเวลา 10 วินาที
  });
}

// Hook สำหรับตรวจสอบสิทธิ์
export function useLoanEligibility(userId: number) {
  return useQuery({
    queryKey: ["/api/loans/eligibility", userId],
    queryFn: () => loanService.checkEligibility(userId),
    staleTime: 60 * 1000, // Cache เป็นเวลา 1 นาที
  });
}

// Hook สำหรับสร้างคำขอสินเชื่อ
export function useCreateLoan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (loanData: CreateLoanRequest) => loanService.createLoanRequest(loanData),
    onSuccess: (newLoan: LoanRequest) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/user", newLoan.userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans/eligibility", newLoan.userId] });
      
      toast({
        title: "สำเร็จ",
        description: "ส่งคำขอสินเชื่อเรียบร้อยแล้ว รอการอนุมัติ",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถส่งคำขอสินเชื่อได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับอัปเดตสถานะสินเชื่อ
export function useUpdateLoanStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ loanId, status, note }: { loanId: number; status: string; note?: string }) =>
      loanService.updateLoanStatus(loanId, status, note),
    onSuccess: (updatedLoan: LoanRequest) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans/user", updatedLoan.userId] });
      
      const statusText = {
        approved: "อนุมัติ",
        rejected: "ปฏิเสธ",
        paid: "ชำระแล้ว",
      }[updatedLoan.status] || updatedLoan.status;

      toast({
        title: "อัปเดตสถานะเรียบร้อย",
        description: `เปลี่ยนสถานะเป็น: ${statusText}`,
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive",
      });
    },
  });
}