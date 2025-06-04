import { useTheme } from "../../hooks/useTheme";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  userId: number;
}

/**
 * Provider สำหรับจัดการธีมของแอปพลิเคชัน
 * นำธีมที่ผู้ใช้เลือกมาใช้กับ UI ทั้งหมด
 */
export function ThemeProvider({ children, userId }: ThemeProviderProps) {
  // ใช้ hook สำหรับจัดการธีม
  const { activeTheme, isLoading } = useTheme(userId);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      activeTheme?.name === 'ธีมสีทอง' ? 'theme-gold' :
      activeTheme?.name === 'ธีมสีดำ' ? 'theme-dark' :
      activeTheme?.name === 'ธีมสีรุ้ง' ? 'theme-rainbow' :
      activeTheme?.name === 'ธีมทองคำ VIP' ? 'theme-vip' : ''
    }`}>
      <style jsx global>{`
        body {
          background: var(--theme-background);
          color: var(--theme-text);
          font-family: var(--theme-font-family);
        }
      `}</style>
      {children}
    </div>
  );
}