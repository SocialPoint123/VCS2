import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useToast } from "../../hooks/use-toast";
import { 
  Store, 
  Plus, 
  Edit, 
  DollarSign,
  Package,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff
} from "lucide-react";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: string;
  type: string;
  rarity: string;
  // imageUrl is removed and mediaUrl is used instead
  isActive?: boolean;
  createdAt: string;
}

interface NewItemForm {
  name: string;
  description: string;
  price: string;
  type: string;
  rarity: string;
  imageUrl: string;
}

/**
 * หน้าจัดการร้านค้าสำหรับแอดมิน
 * รองรับการเพิ่ม แก้ไข และปรับราคาสินค้า
 */
export default function ShopManagement() {
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>({
    name: "",
    description: "",
    price: "",
    type: "theme",
    rarity: "common",
    imageUrl: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ดึงข้อมูลสินค้าทั้งหมด
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/admin/shop/items"],
    queryFn: async () => {
      const response = await fetch("/api/admin/shop/items");
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  // อัปเดตสินค้า
  const updateItemMutation = useMutation({
    mutationFn: async (item: ShopItem) => {
      const response = await fetch(`/api/admin/shop/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shop/items"] });
      setEditingItem(null);
      toast({
        title: "อัปเดตสำเร็จ",
        description: "ข้อมูลสินค้าได้รับการอัปเดตแล้ว",
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

  // เพิ่มสินค้าใหม่
  const addItemMutation = useMutation({
    mutationFn: async (item: NewItemForm) => {
      const response = await fetch("/api/admin/shop/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error("Failed to add item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shop/items"] });
      setIsAddDialogOpen(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        type: "theme",
        rarity: "common",
        imageUrl: "",
      });
      toast({
        title: "เพิ่มสินค้าสำเร็จ",
        description: "สินค้าใหม่ได้รับการเพิ่มลงในระบบแล้ว",
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

  // สลับสถานะการแสดงสินค้า
  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/admin/shop/items/${id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to toggle item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shop/items"] });
      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: "สถานะการแสดงสินค้าได้รับการอัปเดตแล้ว",
      });
    },
  });

  const handleSaveEdit = () => {
    if (editingItem) {
      updateItemMutation.mutate(editingItem);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกชื่อสินค้าและราคา",
        variant: "destructive",
      });
      return;
    }
    addItemMutation.mutate(newItem);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Store className="h-8 w-8" />
            <span>จัดการร้านค้า</span>
          </h1>
          <p className="text-gray-500 mt-2">จัดการสินค้า ราคา และสถานะการแสดงผล</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มสินค้าใหม่
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* สถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">สินค้าทั้งหมด</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">สินค้าที่แสดง</p>
                <p className="text-2xl font-bold text-green-600">
                  {items.filter((item: ShopItem) => item.isActive !== false).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">สินค้าที่ซ่อน</p>
                <p className="text-2xl font-bold text-red-600">
                  {items.filter((item: ShopItem) => item.isActive === false).length}
                </p>
              </div>
              <EyeOff className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">มูลค่ารวม</p>
                <p className="text-2xl font-bold text-purple-600">
                  ฿{items.reduce((sum: number, item: ShopItem) => 
                    sum + parseFloat(item.price || "0"), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: ShopItem) => (
          <Card key={item.id} className={`relative ${item.isActive === false ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    {item.isActive === false && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        ซ่อน
                      </Badge>
                    )}
                  </div>
                </div>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ฿{parseFloat(item.price).toLocaleString()}
                </span>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleItemMutation.mutate({
                      id: item.id,
                      isActive: !(item.isActive !== false)
                    })}
                    disabled={toggleItemMutation.isPending}
                  >
                    {item.isActive !== false ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog แก้ไขสินค้า */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>แก้ไขสินค้า: {editingItem.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">ชื่อสินค้า</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      name: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-price">ราคา (บาท)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      price: e.target.value
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">คำอธิบาย</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">ประเภท</Label>
                  <Select
                    value={editingItem.type}
                    onValueChange={(value) => setEditingItem({
                      ...editingItem,
                      type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theme">ธีม</SelectItem>
                      <SelectItem value="font">ฟอนต์</SelectItem>
                      <SelectItem value="post_frame">กรอบโพสต์</SelectItem>
                      <SelectItem value="profile_frame">กรอบโปรไฟล์</SelectItem>
                      <SelectItem value="emoji">อิโมจิ</SelectItem>
                      <SelectItem value="sticker">สติกเกอร์</SelectItem>
                      <SelectItem value="effect">เอฟเฟกต์</SelectItem>
                      <SelectItem value="badge">แบดจ์</SelectItem>
                      <SelectItem value="background">พื้นหลัง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-rarity">ความหายาก</Label>
                  <Select
                    value={editingItem.rarity}
                    onValueChange={(value) => setEditingItem({
                      ...editingItem,
                      rarity: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">ธรรมดา</SelectItem>
                      <SelectItem value="rare">หายาก</SelectItem>
                      <SelectItem value="epic">เอปิก</SelectItem>
                      <SelectItem value="legendary">ตำนาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-image">URL รูปภาพ</Label>
                <Input
                  id="edit-image"
                  value={editingItem.imageUrl || ""}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    imageUrl: e.target.value
                  })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={updateItemMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateItemMutation.isPending ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog เพิ่มสินค้าใหม่ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-name">ชื่อสินค้า</Label>
                <Input
                  id="new-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    name: e.target.value
                  })}
                  placeholder="ใส่ชื่อสินค้า"
                />
              </div>

              <div>
                <Label htmlFor="new-price">ราคา (บาท)</Label>
                <Input
                  id="new-price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    price: e.target.value
                  })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-description">คำอธิบาย</Label>
              <Textarea
                id="new-description"
                value={newItem.description}
                onChange={(e) => setNewItem({
                  ...newItem,
                  description: e.target.value
                })}
                placeholder="คำอธิบายสินค้า"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-type">ประเภท</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value) => setNewItem({
                    ...newItem,
                    type: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">อิเล็กทรอนิกส์</SelectItem>
                    <SelectItem value="gaming">เกมมิ่ง</SelectItem>
                    <SelectItem value="fashion">แฟชั่น</SelectItem>
                    <SelectItem value="service">บริการ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-rarity">ความหายาก</Label>
                <Select
                  value={newItem.rarity}
                  onValueChange={(value) => setNewItem({
                    ...newItem,
                    rarity: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">ธรรมดา</SelectItem>
                    <SelectItem value="rare">หายาก</SelectItem>
                    <SelectItem value="epic">เอปิก</SelectItem>
                    <SelectItem value="legendary">ตำนาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="new-image">URL รูปภาพ</Label>
              <Input
                id="new-image"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({
                  ...newItem,
                  imageUrl: e.target.value
                })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={addItemMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                {addItemMutation.isPending ? "กำลังเพิ่ม..." : "เพิ่มสินค้า"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}