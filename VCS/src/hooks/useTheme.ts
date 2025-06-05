import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    // อ่านธีมจาก localStorage หรือใช้ default
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // บันทึกธีมใน localStorage
    localStorage.setItem('theme', theme);
    
    // อัปเดต class ใน document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    setTheme,
    toggleTheme
  };
}