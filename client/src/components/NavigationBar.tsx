import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Wallet
} from "lucide-react";
import { useState } from "react";

/**
 * คอมโพเนนท์ Navigation Bar หลัก
 * แสดงเมนูนำทางและปุ่มออกจากระบบ
 */
export default function NavigationBar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // ล้างข้อมูล session/localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // รีโหลดหน้าเพื่อกลับไปยังหน้าแรก
    window.location.href = "/";
  };

  const navItems = [
    {
      path: "/feed",
      label: "หน้าหลัก",
      icon: Home,
      active: location === "/" || location === "/feed"
    },
    {
      path: "/chat",
      label: "แชท",
      icon: MessageSquare,
      active: location.startsWith("/chat")
    },
    {
      path: "/wallet",
      label: "กระเป๋าเงิน",
      icon: Wallet,
      active: location.startsWith("/wallet")
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
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BergDotBet</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      className={`flex items-center space-x-2 ${
                        item.active ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                ออนไลน์
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <span className="text-lg font-bold text-gray-900">BergDotBet</span>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="pb-4 border-t border-gray-100">
              <div className="space-y-1 pt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={item.active ? "default" : "ghost"}
                        className={`w-full justify-start space-x-3 ${
                          item.active ? "bg-blue-600 text-white" : "text-gray-600"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
                
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <button className={`flex flex-col items-center justify-center h-full space-y-1 ${
                  item.active 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom navigation on mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}