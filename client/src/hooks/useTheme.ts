import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface ActiveTheme {
  id: number;
  name: string;
  type: string;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  styles?: {
    borderRadius: string;
    fontFamily: string;
    shadows: string;
  };
}

/**
 * Hook สำหรับจัดการธีมที่ใช้งานอยู่
 * อ่านธีมจากไอเทมที่เปิดใช้งานและนำไปใช้กับ UI
 */
export function useTheme(userId: number) {
  // ดึงไอเทมที่กำลังใช้งานอยู่
  const { data: activeItems, isLoading } = useQuery({
    queryKey: ['/api/inventory', userId, 'active'],
    enabled: !!userId,
  });

  // หาธีมที่กำลังใช้งาน
  const activeTheme = activeItems?.find((item: any) => item.type === 'theme');

  // กำหนดธีมตามไอเทมที่เลือก
  const getThemeConfig = (themeName: string): ActiveTheme => {
    switch (themeName) {
      case 'ธีมสีทอง':
        return {
          id: 2,
          name: 'ธีมสีทอง',
          type: 'theme',
          colors: {
            primary: '#F59E0B',
            secondary: '#FCD34D',
            background: '#FFFBEB',
            text: '#92400E'
          },
          styles: {
            borderRadius: '12px',
            fontFamily: 'serif',
            shadows: '0 10px 15px -3px rgba(245, 158, 11, 0.1)'
          }
        };
      case 'ธีมสีดำ':
        return {
          id: 3,
          name: 'ธีมสีดำ',
          type: 'theme',
          colors: {
            primary: '#1F2937',
            secondary: '#374151',
            background: '#111827',
            text: '#F9FAFB'
          },
          styles: {
            borderRadius: '8px',
            fontFamily: 'sans-serif',
            shadows: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }
        };
      case 'ธีมสีรุ้ง':
        return {
          id: 32,
          name: 'ธีมสีรุ้ง',
          type: 'theme',
          colors: {
            primary: '#EC4899',
            secondary: '#8B5CF6',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            text: '#FFFFFF'
          },
          styles: {
            borderRadius: '16px',
            fontFamily: 'sans-serif',
            shadows: '0 20px 25px -5px rgba(139, 92, 246, 0.2)'
          }
        };
      case 'ธีมทองคำ VIP':
        return {
          id: 34,
          name: 'ธีมทองคำ VIP',
          type: 'theme',
          colors: {
            primary: '#D97706',
            secondary: '#FBBF24',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',
            text: '#92400E'
          },
          styles: {
            borderRadius: '20px',
            fontFamily: 'serif',
            shadows: '0 25px 50px -12px rgba(217, 119, 6, 0.25)'
          }
        };
      default:
        return {
          id: 1,
          name: 'ธีมเริ่มต้น',
          type: 'theme',
          colors: {
            primary: '#3B82F6',
            secondary: '#60A5FA',
            background: '#F8FAFC',
            text: '#1E293B'
          },
          styles: {
            borderRadius: '8px',
            fontFamily: 'sans-serif',
            shadows: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        };
    }
  };

  // ใช้ธีมที่เลือก หรือธีมเริ่มต้น
  const currentTheme = activeTheme?.item?.name 
    ? getThemeConfig(activeTheme.item.name)
    : getThemeConfig('ธีมเริ่มต้น');

  // นำธีมไปใช้กับ CSS Variables
  useEffect(() => {
    if (currentTheme) {
      const root = document.documentElement;
      
      // กำหนด CSS Variables
      root.style.setProperty('--theme-primary', currentTheme.colors.primary);
      root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
      root.style.setProperty('--theme-background', currentTheme.colors.background);
      root.style.setProperty('--theme-text', currentTheme.colors.text);
      root.style.setProperty('--theme-border-radius', currentTheme.styles.borderRadius);
      root.style.setProperty('--theme-font-family', currentTheme.styles.fontFamily);
      root.style.setProperty('--theme-shadows', currentTheme.styles.shadows);

      // เพิ่ม class สำหรับธีมพิเศษ
      document.body.classList.remove('theme-gold', 'theme-dark', 'theme-rainbow', 'theme-vip');
      
      switch (currentTheme.name) {
        case 'ธีมสีทอง':
          document.body.classList.add('theme-gold');
          break;
        case 'ธีมสีดำ':
          document.body.classList.add('theme-dark');
          break;
        case 'ธีมสีรุ้ง':
          document.body.classList.add('theme-rainbow');
          break;
        case 'ธีมทองคำ VIP':
          document.body.classList.add('theme-vip');
          break;
      }
    }
  }, [currentTheme]);

  return {
    activeTheme: currentTheme,
    isLoading,
    hasActiveTheme: !!activeTheme
  };
}