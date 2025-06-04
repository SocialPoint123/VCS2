import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  PawPrint, 
  Plus,
  AlertCircle,
  Sparkles,
  Heart
} from "lucide-react";
import { Link } from "wouter";
import PetStatus from "@/components/pet/PetStatus";
import PetAction from "@/components/pet/PetAction";
import { useUserPet, useCreatePet } from "@/modules/pet/usePet";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/**
 * หน้าสัตว์เลี้ยงหลัก
 * รวมการแสดงสถานะ การดำเนินการ และการสร้างสัตว์เลี้ยงใหม่
 */
export default function PetPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [petType, setPetType] = useState("cat");
  const [petName, setPetName] = useState("");

  const { data: currentUser } = useAdminAuth();
  const userId = currentUser?.user?.id || 0;
  
  const { data: pet, isLoading, error } = useUserPet(userId);
  const createMutation = useCreatePet();

  const handleCreatePet = async () => {
    if (!petName.trim()) return;

    try {
      await createMutation.mutateAsync({
        userId,
        type: petType,
        name: petName.trim(),
      });

      setPetName("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const petTypes = [
    { id: "cat", name: "แมว", emoji: "🐱", description: "เป็นมิตร ชอบเล่น" },
    { id: "dog", name: "หมา", emoji: "🐶", description: "ซื่อสัตย์ รักเจ้าของ" },
    { id: "rabbit", name: "กระต่าย", emoji: "🐰", description: "น่ารัก กระฉับกระเฉง" },
    { id: "bird", name: "นก", emoji: "🐦", description: "ฉลาด มีสีสัน" },
    { id: "hamster", name: "แฮมสเตอร์", emoji: "🐹", description: "เล็กน่ารัก ขยันเก็บของ" },
    { id: "fish", name: "ปลา", emoji: "🐠", description: "สงบ สวยงาม" },
  ];

  if (!currentUser?.user) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            กรุณาเข้าสู่ระบบเพื่อใช้งานระบบสัตว์เลี้ยง
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            เกิดข้อผิดพลาดในการโหลดข้อมูลสัตว์เลี้ยง: {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/feed">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าฟีด
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่มีสัตว์เลี้ยง แสดงหน้าสร้างสัตว์เลี้ยงใหม่
  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/feed">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับ
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <PawPrint className="h-6 w-6" />
                  <span>สัตว์เลี้ยง</span>
                </h1>
                <p className="text-gray-500">เลี้ยงสัตว์เลี้ยงเพื่อผลิตเครดิต</p>
              </div>
            </div>
          </div>

          {/* หน้าต้อนรับ */}
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  <span>ยินดีต้อนรับสู่ระบบสัตว์เลี้ยง!</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-lg text-gray-600">
                  เลี้ยงสัตว์เลี้ยงเพื่อผลิตเครดิตและสร้างความสุข
                </div>

                <div className="bg-blue-50 rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-blue-800 mb-3">คุณสมบัติของระบบสัตว์เลี้ยง:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>ให้อาหารและเล่นเพื่อดูแลสัตว์เลี้ยง</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>เก็บเกี่ยวเครดิตทุก 4 ชั่วโมง</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PawPrint className="h-4 w-4" />
                      <span>สัตว์เลี้ยงจะเติบโตและอัพเลเวล</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>สถานะดีจะให้เครดิตมากขึ้น</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  สร้างสัตว์เลี้ยงของคุณ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog สร้างสัตว์เลี้ยง */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <PawPrint className="h-5 w-5" />
                <span>สร้างสัตว์เลี้ยงใหม่</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* เลือกประเภทสัตว์เลี้ยง */}
              <div>
                <Label className="text-base font-semibold">เลือกประเภทสัตว์เลี้ยง</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {petTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setPetType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        petType === type.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.emoji}</div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ใส่ชื่อ */}
              <div>
                <Label htmlFor="pet-name" className="text-base font-semibold">ตั้งชื่อสัตว์เลี้ยง</Label>
                <Input
                  id="pet-name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="ใส่ชื่อสัตว์เลี้ยงของคุณ..."
                  maxLength={50}
                  className="mt-2"
                />
              </div>

              {/* ตัวอย่างการแสดงผล */}
              {petName && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">ตัวอย่าง:</div>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {petTypes.find(t => t.id === petType)?.emoji}
                    </div>
                    <div>
                      <div className="font-semibold">{petName}</div>
                      <div className="text-sm text-gray-500">
                        {petTypes.find(t => t.id === petType)?.name} เลเวล 1
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleCreatePet}
                  disabled={!petName.trim() || createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>กำลังสร้าง...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>สร้างสัตว์เลี้ยง</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // หน้าหลักของสัตว์เลี้ยง
  const selectedPetType = petTypes.find(t => t.id === pet.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
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
                <PawPrint className="h-6 w-6" />
                <span>สัตว์เลี้ยงของฉัน</span>
              </h1>
              <p className="text-gray-500">ดูแลและเก็บเกี่ยวเครดิตจากสัตว์เลี้ยง</p>
            </div>
          </div>
        </div>

        {/* ข้อมูลสัตว์เลี้ยง */}
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{selectedPetType?.emoji || "🐾"}</div>
                <div>
                  <div className="text-xl font-bold">{pet.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedPetType?.name} เลเวล {pet.level}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">อายุ</div>
                <div className="font-semibold">
                  {Math.floor((new Date().getTime() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24))} วัน
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* เนื้อหาหลัก */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* สถานะสัตว์เลี้ยง */}
          <div>
            <PetStatus pet={pet} userId={userId} />
          </div>

          {/* การดำเนินการ */}
          <div>
            <PetAction pet={pet} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}