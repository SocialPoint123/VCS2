import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Home, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  LogOut,
  User,
  Wallet,
  Store,
  Package,
  PawPrint
} from "lucide-react";

/**
 * แถบนำทางแนวตั้งฝั่งซ้าย
 */
export default function SidebarNavigation() {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const navItems = [
    {
      path: "/feed",
      label: "หน้าแรก",
      icon: Home,
      active: location === "/" || location.startsWith("/feed")
    },
    {
      path: "/chat",
      label: "แชท",
      icon: MessageSquare,
      active: location.startsWith("/chat")
    },
    {
      path: "/shop",
      label: "ร้านค้า",
      icon: Store,
      active: location.startsWith("/shop")
    },
    {
      path: "/inventory",
      label: "กระเป๋าไอเทม",
      icon: Package,
      active: location.startsWith("/inventory")
    },
    {
      path: "/wallet",
      label: "กระเป๋าเงิน",
      icon: Wallet,
      active: location.startsWith("/wallet")
    },
    {
      path: "/pet",
      label: "สัตว์เลี้ยง",
      icon: PawPrint,
      active: location.startsWith("/pet")
    },
    {
      path: "/loan",
      label: "สินเชื่อ",
      icon: DollarSign,
      active: location.startsWith("/loan")
    },
    {
      path: "/profile",
      label: "โปรไฟล์",
      icon: User,
      active: location.startsWith("/profile")
    },
    {
      path: "/admin",
      label: "จัดการระบบ",
      icon: Settings,
      active: location.startsWith("/admin")
    }
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">BB</span>
        </div>
        <span className="text-xl font-bold text-gray-900">BergDotBet</span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 overflow-y-auto">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-12 px-4 transition-all duration-200 ${
                    item.active 
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium text-left">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Actions */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        <Badge variant="secondary" className="bg-green-100 text-green-700 w-full justify-center py-2">
          ออนไลน์
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 h-10"
        >
          <LogOut className="h-4 w-4" />
          <span>ออกจากระบบ</span>
        </Button>
      </div>
    </nav>
  );
}