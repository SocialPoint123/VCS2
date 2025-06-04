import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

interface ItemTooltipProps {
  children: ReactNode;
  item: {
    id: number;
    name: string;
    description: string;
    price: string;
    type: string;
    rarity: string;
    imageUrl?: string;
  };
  isOwned?: boolean;
  isActive?: boolean;
  purchaseDate?: string;
  activationDate?: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'rare':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'epic':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getTypeDisplayName = (type: string) => {
  const typeMap: Record<string, string> = {
    'theme': 'ธีม',
    'font': 'ฟอนต์',
    'frame': 'กรอบ',
    'badge': 'แบดจ์',
    'emoji': 'อิโมจิ',
    'animation': 'อนิเมชั่น',
    'sound': 'เสียง',
    'effect': 'เอฟเฟกต์'
  };
  return typeMap[type] || type;
};

/**
 * คอมโพเนนท์ Tooltip สำหรับแสดงข้อมูลรายละเอียดของไอเทม
 * ใช้สำหรับการจัดการและแสดงข้อมูลไอเทม UI ในระบบ
 */
export function ItemTooltip({
  children,
  item,
  isOwned = false,
  isActive = false,
  purchaseDate,
  activationDate,
  onActivate,
  onDeactivate,
}: ItemTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="w-80 p-4 bg-white border border-gray-200 shadow-lg rounded-lg"
          sideOffset={8}
        >
          <div className="space-y-3">
            {/* Header with name and rarity */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getRarityColor(item.rarity))}
                  >
                    {item.rarity}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {getTypeDisplayName(item.type)}
                  </Badge>
                </div>
              </div>
              {isOwned && (
                <div className="ml-2">
                  {isActive ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      กำลังใช้งาน
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      เป็นเจ้าของ
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">ราคา:</span>
              <span className="font-semibold text-blue-600">
                {parseFloat(item.price).toLocaleString()} เครดิต
              </span>
            </div>

            {/* Ownership and usage details */}
            {isOwned && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                {purchaseDate && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">วันที่ซื้อ:</span>
                    <span className="text-gray-700">
                      {new Date(purchaseDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                
                {isActive && activationDate && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">เริ่มใช้งาน:</span>
                    <span className="text-gray-700">
                      {new Date(activationDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {isOwned && (onActivate || onDeactivate) && (
              <div className="pt-2 border-t border-gray-100">
                {!isActive && onActivate && (
                  <button
                    onClick={onActivate}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    เปิดใช้งาน
                  </button>
                )}
                
                {isActive && onDeactivate && (
                  <button
                    onClick={onDeactivate}
                    className="w-full px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    ปิดใช้งาน
                  </button>
                )}
              </div>
            )}

            {/* Usage tips */}
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              {isOwned ? (
                isActive ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>ไอเทมนี้กำลังทำงานอยู่ในโปรไฟล์ของคุณ</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>คลิกเพื่อเปิดใช้งานไอเทมนี้</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>ซื้อไอเทมนี้เพื่อปรับแต่งโปรไฟล์ของคุณ</span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}