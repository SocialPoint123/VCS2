import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../.././card";
import { Button } from "../.././button";
import { Badge } from "../.././badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../.././tabs";
import { Alert, AlertDescription } from "../.././alert";
import { useToast } from "../hooks/use-toast";
import { ItemTooltip } from "../.././item-tooltip";
import { 
  Package, 
  ArrowLeft, 
  Palette,
  Type,
  Frame,
  UserCircle,
  Smile,
  Sticker,
  Sparkles,
  Award,
  Image,
  Check,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import { useAdminAuth } from "../hooks/useAdminAuth";

interface UserItem {
  id: number;
  userId: number;
  itemId: number;
  createdAt: string;
  item: {
    id: number;
    name: string;
    description: string;
    price: string;
    type: string;
    rarity: string;
    imageUrl?: string;
  };
}

interface ActiveItem {
  type: string;
  itemId: number;
}

/**
 * หน้ากระเป๋าไอเทมสำหรับจัดการไอเทม UI ที่เป็นเจ้าของ
 * รองรับการสลับใช้ธีม ฟอนต์ กรอบ และไอเทมอื่นๆ
 */
export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: currentUser } = useAdminAuth();
  const userId = currentUser?.user?.id || 0;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ดึงไอเทมที่เป็นเจ้าของ
  const { data: userItems = [], isLoading } = useQuery({
    queryKey: ["/api/inventory", userId],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      return response.json();
    },
    enabled: !!userId,
  });

  // ดึงไอเทมที่กำลังใช้งาน
  const { data: activeItems = [] } = useQuery({
    queryKey: ["/api/inventory", userId, "active"],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/${userId}/active`);
      if (!response.ok) throw new Error("Failed to fetch active items");
      return response.json();
    },
    enabled: !!userId,
  });

  // เปิดใช้งานไอเทม
  const activateItemMutation = useMutation({
    mutationFn: async ({ itemId, type }: { itemId: number; type: string }) => {
      const response = await fetch("/api/inventory/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId, type }),
      });
      if (!response.ok) throw new Error("Failed to activate item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory", userId, "active"] });
      toast({
        title: "เปิดใช้งานไอเทมสำเร็จ",
        description: "ไอเทมได้รับการเปิดใช้งานแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "theme": return <Palette className="h-4 w-4" />;
      case "font": return <Type className="h-4 w-4" />;
      case "post_frame": return <Frame className="h-4 w-4" />;
      case "profile_frame": return <UserCircle className="h-4 w-4" />;
      case "emoji": return <Smile className="h-4 w-4" />;
      case "sticker": return <Sticker className="h-4 w-4" />;
      case "effect": return <Sparkles className="h-4 w-4" />;
      case "badge": return <Award className="h-4 w-4" />;
      case "background": return <Image className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "theme": return "bg-purple-100 text-purple-800";
      case "font": return "bg-blue-100 text-blue-800";
      case "post_frame": return "bg-green-100 text-green-800";
      case "profile_frame": return "bg-yellow-100 text-yellow-800";
      case "emoji": return "bg-pink-100 text-pink-800";
      case "sticker": return "bg-orange-100 text-orange-800";
      case "effect": return "bg-red-100 text-red-800";
      case "badge": return "bg-indigo-100 text-indigo-800";
      case "background": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare": return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "theme": return "ธีม";
      case "font": return "ฟอนต์";
      case "post_frame": return "กรอบโพสต์";
      case "profile_frame": return "กรอบโปรไฟล์";
      case "emoji": return "อิโมจิ";
      case "sticker": return "สติกเกอร์";
      case "effect": return "เอฟเฟกต์";
      case "badge": return "แบดจ์";
      case "background": return "พื้นหลัง";
      default: return type;
    }
  };

  const isItemActive = (itemId: number, type: string) => {
    return activeItems.some((active: ActiveItem) => 
      active.itemId === itemId && active.type === type
    );
  };

  const getActiveItemDate = (itemId: number, type: string) => {
    const activeItem = activeItems.find((active: ActiveItem) => 
      active.itemId === itemId && active.type === type
    );
    return activeItem?.activatedAt;
  };

  const handleActivateItem = (itemId: number, type: string) => {
    activateItemMutation.mutate({ itemId, type });
  };

  const deactivateItem = (itemId: number, type: string) => {
    // สำหรับอนาคต: การปิดใช้งานไอเทม
    console.log("Deactivating item:", itemId, type);
  };

  const filterItemsByType = (type: string) => {
    if (type === "all") return userItems;
    return userItems.filter((item: UserItem) => item.item.type === type);
  };

  const getItemsByCategory = () => {
    const categories = [
      { key: "all", name: "ทั้งหมด", icon: <Package className="h-4 w-4" /> },
      { key: "theme", name: "ธีม", icon: <Palette className="h-4 w-4" /> },
      { key: "font", name: "ฟอนต์", icon: <Type className="h-4 w-4" /> },
      { key: "post_frame", name: "กรอบโพสต์", icon: <Frame className="h-4 w-4" /> },
      { key: "profile_frame", name: "กรอบโปรไฟล์", icon: <UserCircle className="h-4 w-4" /> },
      { key: "emoji", name: "อิโมจิ", icon: <Smile className="h-4 w-4" /> },
      { key: "sticker", name: "สติกเกอร์", icon: <Sticker className="h-4 w-4" /> },
      { key: "effect", name: "เอฟเฟกต์", icon: <Sparkles className="h-4 w-4" /> },
      { key: "badge", name: "แบดจ์", icon: <Award className="h-4 w-4" /> },
      { key: "background", name: "พื้นหลัง", icon: <Image className="h-4 w-4" /> },
    ];

    return categories.map(category => ({
      ...category,
      count: category.key === "all" ? userItems.length : filterItemsByType(category.key).length
    }));
  };

  if (!currentUser?.user) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            กรุณาเข้าสู่ระบบเพื่อดูกระเป๋าไอเทม
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/shop">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปร้านค้า
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <Package className="h-8 w-8" />
                <span>กระเป๋าไอเทม</span>
              </h1>
              <p className="text-gray-500 mt-2">จัดการไอเทม UI ที่คุณเป็นเจ้าของ</p>
            </div>
          </div>
        </div>

        {/* สถิติ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{userItems.length}</div>
              <div className="text-sm text-gray-500">ไอเทมทั้งหมด</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{activeItems.length}</div>
              <div className="text-sm text-gray-500">กำลังใช้งาน</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                ฿{userItems.reduce((sum: number, item: UserItem) => 
                  sum + parseFloat(item.item.price || "0"), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">มูลค่ารวม</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {userItems.filter((item: UserItem) => item.item.rarity === "legendary").length}
              </div>
              <div className="text-sm text-gray-500">ไอเทมตำนาน</div>
            </CardContent>
          </Card>
        </div>

        {/* แท็บหมวดหมู่ */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
            {getItemsByCategory().map((category) => (
              <TabsTrigger
                key={category.key}
                value={category.key}
                className="flex flex-col items-center space-y-1 text-xs"
              >
                {category.icon}
                <span className="hidden sm:block">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {getItemsByCategory().map((category) => (
            <TabsContent key={category.key} value={category.key}>
              {filterItemsByType(category.key).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      ไม่มีไอเทม{category.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      คุณยังไม่มีไอเทม{category.name}ในกระเป๋า
                    </p>
                    <Link href="/shop">
                      <Button>
                        ไปซื้อไอเทม
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterItemsByType(category.key).map((userItem: UserItem) => (
                    <ItemTooltip
                      key={userItem.id}
                      item={userItem.item}
                      isOwned={true}
                      isActive={isItemActive(userItem.item.id, userItem.item.type)}
                      purchaseDate={userItem.createdAt}
                      activationDate={getActiveItemDate(userItem.item.id, userItem.item.type)}
                      onActivate={() => activateItemMutation.mutate({
                        itemId: userItem.item.id,
                        type: userItem.item.type
                      })}
                      onDeactivate={() => deactivateItem(userItem.item.id, userItem.item.type)}
                    >
                      <Card 
                        className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
                          isItemActive(userItem.item.id, userItem.item.type) 
                            ? 'ring-2 ring-green-500 bg-green-50' 
                            : 'hover:ring-2 hover:ring-blue-200'
                        }`}
                      >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center space-x-2">
                              {getTypeIcon(userItem.item.type)}
                              <span>{userItem.item.name}</span>
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className={getRarityColor(userItem.item.rarity)}>
                                {userItem.item.rarity}
                              </Badge>
                              <Badge className={getTypeColor(userItem.item.type)}>
                                {getTypeName(userItem.item.type)}
                              </Badge>
                            </div>
                          </div>
                          {userItem.item.imageUrl && (
                            <img 
                              src={userItem.item.imageUrl} 
                              alt={userItem.item.name}
                              className="w-16 h-16 object-cover rounded-lg ml-4"
                            />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {userItem.item.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            ฿{parseFloat(userItem.item.price).toLocaleString()}
                          </span>
                          
                          {isItemActive(userItem.item.id, userItem.item.type) ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              กำลังใช้งาน
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleActivateItem(userItem.item.id, userItem.item.type)}
                              disabled={activateItemMutation.isPending}
                            >
                              {activateItemMutation.isPending ? "กำลังเปิดใช้..." : "เปิดใช้งาน"}
                            </Button>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          ซื้อเมื่อ: {new Date(userItem.createdAt).toLocaleDateString('th-TH')}
                        </div>
                      </CardContent>

                      {isItemActive(userItem.item.id, userItem.item.type) && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </Card>
                    </ItemTooltip>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}