import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/adminService";

export function useAdminAuth() {
  return useQuery({
    queryKey: ["/api/admin/auth"],
    queryFn: () => adminService.checkAdminAuth(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
