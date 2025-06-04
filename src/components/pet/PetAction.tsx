import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { 
  UtensilsCrossed, 
  GamepadIcon, 
  Gift, 
  Edit,
  Clock,
  Star,
  Heart,
  Zap,
  Coins
} from "lucide-react";
import { usePetAction, useRenamePet } from "../modules/pet/usePet";
import { petService } from "../modules/pet/petService";
import type { Pet } from "../modules/pet/petService";

interface PetActionProps {
  pet: Pet;
  userId: number;
}

/**
 * คอมโพเนนท์สำหรับการดำเนินการกับสัตว์เลี้ยง
 * รองรับการให้อาหาร เล่น เก็บเกี่ยว และเปลี่ยนชื่อ
 */
export default function PetAction({ pet, userId }: PetActionProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(pet.name);
  
  const actionMutation = usePetAction();
  const renameMutation = useRenamePet();

  const collectInfo = petService.calculateTimeUntilCollect(pet.lastCollectedAt);
  const collectAmount = petService.calculateCollectAmount(pet.level, pet.mood, pet.energy);

  const handleAction = async (action: 'feed' | 'play' | 'collect') => {
    try {
      await actionMutation.mutateAsync({
        userId,
        action,
      });
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === pet.name) return;

    try {
      await renameMutation.mutateAsync({
        userId,
        name: newName.trim(),
      });
      setIsRenameDialogOpen(false);
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const getActionCooldown = (lastActionTime: string, cooldownHours: number = 2) => {
    const now = new Date();
    const lastAction = new Date(lastActionTime);
    const hoursSinceAction = (now.getTime() - lastAction.getTime()) / (1000 * 60 * 60);
    
    const canAct = hoursSinceAction >= cooldownHours;
    const hoursRemaining = canAct ? 0 : cooldownHours - hoursSinceAction;
    
    return { canAct, hoursRemaining };
  };

  const formatCooldownTime = (hours: number) => {
    if (hours <= 0) return "พร้อม";
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.floor((hours - wholeHours) * 60);
    
    if (wholeHours > 0 && minutes > 0) {
      return `${wholeHours}ชม ${minutes}น`;
    } else if (wholeHours > 0) {
      return `${wholeHours}ชม`;
    } else {
      return `${minutes}น`;
    }
  };

  const feedCooldown = getActionCooldown(pet.lastFedAt);
  const playCooldown = getActionCooldown(pet.lastPlayedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GamepadIcon className="h-5 w-5" />
            <span>การดำเนินการ</span>
          </div>
          
          <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                เปลี่ยนชื่อ
              </Button>
            </DialogTrigger>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* การให้อาหาร */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">ให้อาหาร</span>
            </div>
            <Badge className={feedCooldown.canAct ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {formatCooldownTime(feedCooldown.hoursRemaining)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-orange-700">
              <div className="flex items-center space-x-1 mb-2">
                <Zap className="h-4 w-4" />
                <span>เพิ่มพลังงาน +15-25</span>
              </div>
              <p>ให้อาหารสัตว์เลี้ยงเพื่อเพิ่มพลังงาน สัตว์เลี้ยงที่มีพลังงานเต็มจะให้เครดิตมากขึ้น</p>
            </div>
            
            <Button
              onClick={() => handleAction('feed')}
              disabled={!feedCooldown.canAct || actionMutation.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {actionMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>กำลังให้อาหาร...</span>
                </div>
              ) : !feedCooldown.canAct ? (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>รอ {formatCooldownTime(feedCooldown.hoursRemaining)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>ให้อาหาร</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* การเล่น */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <GamepadIcon className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">เล่นด้วยกัน</span>
            </div>
            <Badge className={playCooldown.canAct ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {formatCooldownTime(playCooldown.hoursRemaining)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-purple-700">
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>+10-20 อารมณ์</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>+5-15 exp</span>
                </div>
              </div>
              <p>เล่นกับสัตว์เลี้ยงเพื่อเพิ่มอารมณ์และประสบการณ์ อารมณ์ดีจะช่วยเพิ่มเครดิตที่ได้รับ</p>
            </div>
            
            <Button
              onClick={() => handleAction('play')}
              disabled={!playCooldown.canAct || actionMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {actionMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>กำลังเล่น...</span>
                </div>
              ) : !playCooldown.canAct ? (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>รอ {formatCooldownTime(playCooldown.hoursRemaining)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <GamepadIcon className="h-4 w-4" />
                  <span>เล่นด้วยกัน</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* การเก็บเกี่ยว */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">เก็บเกี่ยวเครดิต</span>
            </div>
            <Badge className={collectInfo.canCollect ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {collectInfo.canCollect ? "พร้อม!" : formatCooldownTime(collectInfo.hoursRemaining)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-green-700">
              <div className="flex items-center space-x-1 mb-2">
                <Coins className="h-4 w-4" />
                <span>จะได้รับ {collectAmount} เครดิต</span>
              </div>
              <p>เก็บเกี่ยวเครดิตจากสัตว์เลี้ยงได้ทุก 4 ชั่วโมง จำนวนเครดิตขึ้นอยู่กับเลเวล พลังงาน และอารมณ์</p>
            </div>
            
            <Button
              onClick={() => handleAction('collect')}
              disabled={!collectInfo.canCollect || actionMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {actionMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>กำลังเก็บเกี่ยว...</span>
                </div>
              ) : !collectInfo.canCollect ? (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>รอ {formatCooldownTime(collectInfo.hoursRemaining)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>เก็บเกี่ยว {collectAmount} เครดิต</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* ข้อมูลเพิ่มเติม */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">หมายเหตุ:</p>
            <ul className="space-y-1 text-xs">
              <li>• ให้อาหารและเล่นได้ทุก 2 ชั่วโมง</li>
              <li>• เก็บเกี่ยวเครดิตได้ทุก 4 ชั่วโมง</li>
              <li>• สถานะสัตว์เลี้ยงจะลดลงตามเวลา</li>
              <li>• ดูแลสัตว์เลี้ยงเป็นประจำเพื่อเครดิตสูงสุด</li>
            </ul>
          </div>
        </div>

        {/* Dialog สำหรับเปลี่ยนชื่อ */}
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>เปลี่ยนชื่อสัตว์เลี้ยง</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pet-name">ชื่อใหม่</Label>
                <Input
                  id="pet-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ใส่ชื่อใหม่..."
                  maxLength={50}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsRenameDialogOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleRename}
                  disabled={!newName.trim() || newName === pet.name || renameMutation.isPending}
                >
                  {renameMutation.isPending ? "กำลังเปลี่ยน..." : "ยืนยัน"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}