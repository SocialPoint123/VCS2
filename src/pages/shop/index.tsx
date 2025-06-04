import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../.././card";
import { Button } from "../.././button";
import { Input } from "../.././input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../.././tabs";
import { Badge } from "../.././badge";
import { Alert, AlertDescription } from "../.././alert";
import { 
  ArrowLeft, 
  Search, 
  Store,
  Palette,
  Star,
  Award,
  Frame,
  Filter,
  Grid,
  List,
  Wallet,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import ShopItem from "../../components/shop/ShopItem";
import { useShopItems, useUserItems } from "../../modules/shop/useShop";
import { useWallet } from "../../modules/wallet/useWallet";
import { useAdminAuth } from "../../hooks/useAdminAuth";

/**
 * หน้าร้านค้าหลัก
 * แสดงไอเทมทั้งหมดพร้อมระบบค้นหาและกรอง
 */
export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { data: currentUser } = useAdminAuth();
  const userId = currentUser?.user?.id || 0;
  
  const { data: shopItems, isLoading, error } = useShopItems();
  const { data: userItems } = useUserItems(userId);
  const { data: wallet } = useWallet(userId);

  if (!currentUser?.user) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            กรุณาเข้าสู่ระบบเพื่อใช้งานร้านค้า
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // กรองไอเทมตามเงื่อนไข
  const filteredItems = shopItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === "all" || item.type === activeTab;
    const matchesRarity = !selectedRarity || item.rarity === selectedRarity;
    
    return matchesSearch && matchesType && matchesRarity && item.isAvailable;
  }) || [];

  // จัดเรียงตามความหายาก
  const sortedItems = filteredItems.sort((a, b) => {
    const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4 };
    const rarityA = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
    const rarityB = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
    return rarityB - rarityA; // เรียงจากหายากมากไปน้อย
  });

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'theme': return <Palette className="h-4 w-4" />;
      case 'icon': return <Star className="h-4 w-4" />;
      case 'badge': return <Award className="h-4 w-4" />;
      case 'frame': return <Frame className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  const getTabLabel = (type: string) => {
    const labels = {
      'all': 'ทั้งหมด',
      'theme': 'ธีม',
      'icon': 'ไอคอน',
      'badge': 'แบดจ์',
      'frame': 'เฟรม',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      'common': 'ธรรมดา',
      'rare': 'หายาก', 
      'epic': 'เอปิก',
      'legendary': 'ตำนาน',
    };
    return labels[rarity as keyof typeof labels] || rarity;
  };

  const currentBalance = parseFloat(wallet?.balance || "0");
  const ownedItemIds = userItems?.map(ui => ui.itemId) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับ
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Store className="h-6 w-6" />
                <span>ร้านค้า</span>
              </h1>
              <p className="text-gray-500">ซื้อไอเทมเพื่อตกแต่งโปรไฟล์ของคุณ</p>
            </div>
          </div>

          {/* ยอดเครดิต */}
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg border px-4 py-2 flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-600">
                {currentBalance.toLocaleString()} บาท
              </span>
            </div>
            <Link href="/wallet">
              <Button variant="outline" size="sm">
                เติมเงิน
              </Button>
            </Link>
          </div>
        </div>

        {/* สถิติและข้อมูลภาพรวม */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {shopItems?.length || 0}
              </div>
              <div className="text-sm text-gray-600">ไอเทมทั้งหมด</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {ownedItemIds.length}
              </div>
              <div className="text-sm text-gray-600">ไอเทมที่มี</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {shopItems?.filter(item => item.rarity === 'legendary').length || 0}
              </div>
              <div className="text-sm text-gray-600">ไอเทมตำนาน</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentBalance.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">เครดิตคงเหลือ</div>
            </CardContent>
          </Card>
        </div>

        {/* ช่องค้นหาและตัวกรอง */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>ค้นหาและกรอง</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* ช่องค้นหา */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาไอเทมที่ต้องการ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* กรองตามความหายาก */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">ทุกความหายาก</option>
                  <option value="common">ธรรมดา</option>
                  <option value="rare">หายาก</option>
                  <option value="epic">เอปิก</option>
                  <option value="legendary">ตำนาน</option>
                </select>
              </div>

              {/* เปลี่ยนรูปแบบการแสดง */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* แสดงผลการกรอง */}
            {(searchQuery || selectedRarity) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">ผลการค้นหา:</span>
                <Badge variant="secondary">
                  {filteredItems.length} ไอเทม
                </Badge>
                {searchQuery && (
                  <Badge variant="outline">
                    ค้นหา: "{searchQuery}"
                  </Badge>
                )}
                {selectedRarity && (
                  <Badge variant="outline">
                    ความหายาก: {getRarityLabel(selectedRarity)}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRarity("");
                  }}
                >
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* แท็บประเภทไอเทม */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {['all', 'theme', 'icon', 'badge', 'frame'].map((type) => (
              <TabsTrigger key={type} value={type} className="flex items-center space-x-2">
                {getTabIcon(type)}
                <span>{getTabLabel(type)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  เกิดข้อผิดพลาดในการโหลดไอเทม: {error.message}
                </AlertDescription>
              </Alert>
            ) : sortedItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchQuery || selectedRarity ? "ไม่พบไอเทมที่ตรงกับเงื่อนไข" : "ไม่มีไอเทมในหมวดนี้"}
                  </p>
                  {(searchQuery || selectedRarity) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedRarity("");
                      }}
                    >
                      ล้างตัวกรอง
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {sortedItems.map((item) => (
                  <ShopItem
                    key={item.id}
                    item={item}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}