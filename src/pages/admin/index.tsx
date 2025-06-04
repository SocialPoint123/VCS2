import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardStats from "../../components/admin/DashboardStats";
import UserManagementTable from "../../components/admin/UserManagementTable";
import LoginLogsModal from "../../components/admin/LoginLogsModal";
import CreditLogsModal from "../../components/admin/CreditLogsModal";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { Card, CardContent } from "../.././card";
import { AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  
  const { data: authData, isLoading: authLoading, error: authError } = useAdminAuth();

  const handleShowLoginLogs = (userId: number) => {
    setSelectedUserId(userId);
    setShowLoginModal(true);
  };

  const handleShowCreditLogs = (userId: number) => {
    setSelectedUserId(userId);
    setShowCreditModal(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (authError || !authData?.isAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">ไม่มีสิทธิ์เข้าถึง</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <DashboardStats />
        <div className="mt-8">
          <UserManagementTable
            onShowLoginLogs={handleShowLoginLogs}
            onShowCreditLogs={handleShowCreditLogs}
          />
        </div>
      </div>

      {showLoginModal && selectedUserId && (
        <LoginLogsModal
          userId={selectedUserId}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {showCreditModal && selectedUserId && (
        <CreditLogsModal
          userId={selectedUserId}
          onClose={() => setShowCreditModal(false)}
        />
      )}
    </AdminLayout>
  );
}
