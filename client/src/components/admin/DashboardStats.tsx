import { useQuery } from "@tanstack/react-query";
import { Users, Circle, Coins, ArrowRightLeft } from "lucide-react";

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">ผู้ใช้ทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalUsers?.toLocaleString() || 0}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="text-blue-600 h-6 w-6" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-medium">+12%</span>
          <span className="text-gray-500 text-sm ml-2">จากเดือนที่แล้ว</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">ผู้ใช้ออนไลน์</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.onlineUsers?.toLocaleString() || 0}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Circle className="text-green-600 h-6 w-6" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-medium">+5%</span>
          <span className="text-gray-500 text-sm ml-2">จากชั่วโมงที่แล้ว</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">เครดิตรวม</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₿{stats?.totalCredits || "0.00"}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Coins className="text-yellow-600 h-6 w-6" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-red-600 text-sm font-medium">-2%</span>
          <span className="text-gray-500 text-sm ml-2">จากเดือนที่แล้ว</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">ธุรกรรมวันนี้</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.todayTransactions?.toLocaleString() || 0}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ArrowRightLeft className="text-purple-600 h-6 w-6" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-medium">+18%</span>
          <span className="text-gray-500 text-sm ml-2">จากเมื่อวาน</span>
        </div>
      </div>
    </div>
  );
}
