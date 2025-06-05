import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardStats from "../../components/admin/DashboardStats";
import UserManagementTable from "../../components/admin/UserManagementTable";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminDashboard() {
  const { data: adminData, isLoading } = useAdminAuth();
  const isAdmin = adminData?.isAdmin || false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">ไม่มีสิทธิ์เข้าถึง</h1>
              <p className="text-gray-600">คุณไม่มีสิทธิ์เข้าถึงหน้าแอดมิน</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดแอดมิน</h1>
        </div>

        <DashboardStats />

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">จัดการผู้ใช้</TabsTrigger>
            <TabsTrigger value="transactions">ธุรกรรม</TabsTrigger>
            <TabsTrigger value="loans">สินเชื่อ</TabsTrigger>
            <TabsTrigger value="posts">โพสต์</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>จัดการผู้ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagementTable 
                  onShowLoginLogs={() => {}}
                  onShowCreditLogs={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ประวัติธุรกรรม</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">รายการธุรกรรมเครดิตทั้งหมด</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>คำขอสินเชื่อ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">รายการคำขอสินเชื่อที่รออนุมัติ</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>จัดการโพสต์</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">โพสต์ทั้งหมดในระบบ</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}