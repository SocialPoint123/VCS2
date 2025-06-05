import { Users, CreditCard, History, Settings, UserCircle, LogOut, BarChart3 } from "lucide-react";

export default function AdminSidebar() {
  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">BergDotBet</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 py-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">เมนูหลัก</h3>
        </div>
        
        <div className="mt-2">
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-500 border-r-2 border-blue-600">
            <BarChart3 className="mr-3 h-4 w-4" />
            แดชบอร์ด
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Users className="mr-3 h-4 w-4" />
            จัดการผู้ใช้
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <CreditCard className="mr-3 h-4 w-4" />
            ธุรกรรมเครดิต
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <History className="mr-3 h-4 w-4" />
            ประวัติล็อกอิน
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Settings className="mr-3 h-4 w-4" />
            ตั้งค่า
          </a>
        </div>
        
        <div className="mt-8 px-6 py-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">บัญชี</h3>
        </div>
        
        <div className="mt-2">
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <UserCircle className="mr-3 h-4 w-4" />
            โปรไฟล์
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="mr-3 h-4 w-4" />
            ออกจากระบบ
          </a>
        </div>
      </nav>
    </div>
  );
}
