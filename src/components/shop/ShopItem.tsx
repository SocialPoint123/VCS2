import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { 
  ShoppingCart, 
  Check, 
  Star, 
  Gem, 
  Crown,
  Sparkles,
  Eye,
  CreditCard
} from "lucide-react";
import { usePurchaseItem, useCheckItemOwnership } from "../modules/shop/useShop";
import { useWallet } from "../modules/wallet/useWallet";
import type { ShopItem } from "../modules/shop/shopService";

interface ShopItemProps {
  item: ShopItem;
  userId: number;
}

/**
 * คอมโพเนนท์แสดงไอเทมในร้านค้า
 * รองรับการซื้อและแสดงสถานะความเป็นเจ้าของ
 */
export default function ShopItem({ item, userId }: ShopItemProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const purchaseMutation = usePurchaseItem();
  const { data: wallet } = useWallet(userId);
  const { data: ownsItem } = useCheckItemOwnership(userId, item.id);

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Star className="h-4 w-4" />;
      case 'rare':
        return <Gem className="h-4 w-4" />;
      case 'epic':
        return <Crown className="h-4 w-4" />;
      case 'legendary':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return "bg-gray-100 text-gray-700 border-gray-300";
      case 'rare':
        return "bg-blue-100 text-blue-700 border-blue-300";
      case 'epic':
        return "bg-purple-100 text-purple-700 border-purple-300";
      case 'legendary':
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return "from-gray-50 to-gray-100";
      case 'rare':
        return "from-blue-50 to-blue-100";
      case 'epic':
        return "from-purple-50 to-purple-100";
      case 'legendary':
        return "from-yellow-50 to-yellow-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      'theme': 'ธีม',
      'icon': 'ไอคอน', 
      'badge': 'แบดจ์',
      'frame': 'เฟรม',
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getRarityLabel = (rarity: string) => {
    const rarityLabels = {
      'common': 'ธรรมดา',
      'rare': 'หายาก',
      'epic': 'เอปิก',
      'legendary': 'ตำนาน',
    };
    return rarityLabels[rarity as keyof typeof rarityLabels] || rarity;
  };

  const handlePurchase = async () => {
    if (ownsItem || !userId) return;

    try {
      await purchaseMutation.mutateAsync({
        userId,
        itemId: item.id,
      });
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const currentBalance = parseFloat(wallet?.balance || "0");
  const itemPrice = parseFloat(item.price);
  const canAfford = currentBalance >= itemPrice;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${getRarityGradient(item.rarity)} border-2 ${getRarityColor(item.rarity).split(' ')[2]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold line-clamp-1">
              {item.name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {getTypeLabel(item.type)}
              </Badge>
              <Badge className={`text-xs border ${getRarityColor(item.rarity)}`}>
                {getRarityIcon(item.rarity)}
                <span className="ml-1">{getRarityLabel(item.rarity)}</span>
              </Badge>
            </div>
          </div>
          
          {ownsItem && (
            <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium">มีแล้ว</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* รูปภาพไอเทม */}
        <div className="relative">
          <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
            {item.mediaUrl ? (
              <img 
                src={item.mediaUrl} 
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // แสดง placeholder ถ้าโหลดรูปไม่ได้
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 space-y-2">
                <div className="text-4xl">
                  {item.type === 'theme' ? '🎨' : 
                   item.type === 'icon' ? '⭐' : 
                   item.type === 'badge' ? '🏆' : '🖼️'}
                </div>
                <span className="text-xs text-center">{item.name}</span>
              </div>
            )}
          </div>
          
          {/* ปุ่มดูตัวอย่าง */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 opacity-80 hover:opacity-100"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
                  {item.mediaUrl ? (
                    <img 
                      src={item.mediaUrl} 
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-6xl">
                      {item.type === 'theme' ? '🎨' : 
                       item.type === 'icon' ? '⭐' : 
                       item.type === 'badge' ? '🏆' : '🖼️'}
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* คำอธิบาย */}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* ราคาและปุ่มซื้อ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                {parseFloat(item.price).toLocaleString()} บาท
              </span>
            </div>
            
            {!canAfford && !ownsItem && (
              <span className="text-xs text-red-600">เครดิตไม่เพียงพอ</span>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handlePurchase}
            disabled={ownsItem || !canAfford || purchaseMutation.isPending || !item.isAvailable}
            variant={ownsItem ? "secondary" : "default"}
          >
            {purchaseMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>กำลังซื้อ...</span>
              </div>
            ) : ownsItem ? (
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>มีแล้ว</span>
              </div>
            ) : !item.isAvailable ? (
              "ไม่มีจำหน่าย"
            ) : !canAfford ? (
              "เครดิตไม่เพียงพอ"
            ) : (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>ซื้อ</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}