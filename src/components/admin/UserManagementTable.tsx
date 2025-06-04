import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, History, Coins } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";

// ประเภทข้อมูลผู้ใช้ที่แสดงในตาราง
interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
  creditBalance: string;
}

// Props สำหรับคอมโพเนนท์ตารางจัดการผู้ใช้
interface UserManagementTableProps {
  onShowLoginLogs: (userId: number) => void;    // ฟังก์ชันแสดงประวัติล็อกอิน
  onShowCreditLogs: (userId: number) => void;   // ฟังก์ชันแสดงประวัติเครดิต
}

/**
 * คอมโพเนนท์ตารางจัดการผู้ใช้
 * แสดงรายชื่อผู้ใช้พร้อมฟีเจอร์ค้นหาและจัดการ
 */
export default function UserManagementTable({ onShowLoginLogs, onShowCreditLogs }: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");      // คำค้นหาผู้ใช้
  const { toast } = useToast();                          // ฟังก์ชันแสดงข้อความแจ้งเตือน
  const queryClient = useQueryClient();                  // ตัวจัดการ cache ของ React Query

  // ดึงข้อมูลรายชื่อผู้ใช้ทั้งหมด
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Mutation สำหรับอัปเดตสถานะผู้ใช้
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "สำเร็จ",
        description: "อัปเดตสถานะผู้ใช้เรียบร้อยแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะผู้ใช้ได้",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">ใช้งาน</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">ระงับชั่วคราว</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">ถูกแบน</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">จัดการผู้ใช้</h3>
            <p className="text-sm text-gray-500 mt-1">รายชื่อผู้ใช้และข้อมูลเครดิต</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มผู้ใช้
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ผู้ใช้
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                อีเมล
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                วันที่สมัคร
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เครดิตคงเหลือ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150`}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₿{user.creditBalance}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onShowLoginLogs(user.id)}
                      className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      <History className="mr-1 h-3 w-3" />
                      ประวัติล็อกอิน
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onShowCreditLogs(user.id)}
                      className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      <Coins className="mr-1 h-3 w-3" />
                      ประวัติเครดิต
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              แสดง <span className="font-medium">1</span> ถึง <span className="font-medium">{filteredUsers.length}</span> จาก <span className="font-medium">{users?.length || 0}</span> รายการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
