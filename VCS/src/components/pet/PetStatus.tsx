import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { 
  Heart, 
  Zap, 
  Star, 
  TrendingUp,
  Clock,
  Gift,
  Award
} from "lucide-react";
import { usePetStats } from "../modules/pet/usePet";
import { petService } from "../modules/pet/petService";
import type { Pet } from "../modules/pet/petService";

interface PetStatusProps {
  pet: Pet;
  userId: number;
}

/**
 * คอมโพเนนท์แสดงสถานะและสถิติของสัตว์เลี้ยง
 * รวมพลังงาน อารมณ์ เลเวล และข้อมูลการเก็บเกี่ยว
 */
export default function PetStatus({ pet, userId }: PetStatusProps) {
  const { data: stats, isLoading } = usePetStats(userId);

  const getStatusColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 50) return "text-yellow-600";
    if (value >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusBgColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-500";
    if (value >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusLabel = (value: number) => {
    if (value >= 90) return "ยอดเยี่ยม";
    if (value >= 70) return "ดี";
    if (value >= 50) return "ปานกลาง";
    if (value >= 30) return "ต่ำ";
    return "ต่ำมาก";
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return "พร้อมเก็บเกี่ยวแล้ว!";
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.floor((hours - wholeHours) * 60);
    
    if (wholeHours > 0 && minutes > 0) {
      return `${wholeHours} ชั่วโมง ${minutes} นาที`;
    } else if (wholeHours > 0) {
      return `${wholeHours} ชั่วโมง`;
    } else {
      return `${minutes} นาที`;
    }
  };

  const collectInfo = petService.calculateTimeUntilCollect(pet.lastCollectedAt);
  const collectAmount = petService.calculateCollectAmount(pet.level, pet.mood, pet.energy);
  const expToNext = petService.calculateExperienceToNext(pet.level, pet.experience);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>สถานะสัตว์เลี้ยง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>สถานะสัตว์เลี้ยง</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ข้อมูลพื้นฐาน */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              Lv.{pet.level}
            </div>
            <div className="text-sm text-blue-800">เลเวล</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {pet.experience}
            </div>
            <div className="text-sm text-purple-800">ประสบการณ์</div>
          </div>
        </div>

        {/* แถบประสบการณ์ */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>ความคืบหน้าเลเวล</span>
            <span>{pet.experience}/{pet.experience + expToNext}</span>
          </div>
          <Progress 
            value={(pet.experience / (pet.experience + expToNext)) * 100} 
            className="h-2"
          />
          <div className="text-xs text-gray-500 text-center">
            ต้องการ {expToNext} exp เพื่อเลเวลถัดไป
          </div>
        </div>

        {/* สถานะพลังงานและอารมณ์ */}
        <div className="space-y-4">
          {/* พลังงาน */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className={`h-4 w-4 ${getStatusColor(pet.energy)}`} />
                <span className="font-medium">พลังงาน</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${getStatusColor(pet.energy)}`}>
                  {pet.energy}/100
                </span>
                <Badge className={`text-xs ${getStatusColor(pet.energy)} bg-transparent border`}>
                  {getStatusLabel(pet.energy)}
                </Badge>
              </div>
            </div>
            <Progress 
              value={pet.energy} 
              className="h-3"
              style={{
                background: `linear-gradient(to right, ${getStatusBgColor(pet.energy)} ${pet.energy}%, #e5e7eb ${pet.energy}%)`
              }}
            />
          </div>

          {/* อารมณ์ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className={`h-4 w-4 ${getStatusColor(pet.mood)}`} />
                <span className="font-medium">อารมณ์</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${getStatusColor(pet.mood)}`}>
                  {pet.mood}/100
                </span>
                <Badge className={`text-xs ${getStatusColor(pet.mood)} bg-transparent border`}>
                  {getStatusLabel(pet.mood)}
                </Badge>
              </div>
            </div>
            <Progress 
              value={pet.mood} 
              className="h-3"
              style={{
                background: `linear-gradient(to right, ${getStatusBgColor(pet.mood)} ${pet.mood}%, #e5e7eb ${pet.mood}%)`
              }}
            />
          </div>
        </div>

        {/* ข้อมูลการเก็บเกี่ยว */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">การเก็บเกี่ยว</span>
            </div>
            <Badge className={collectInfo.canCollect ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {collectInfo.canCollect ? "พร้อม!" : "รอ..."}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>เครดิตที่จะได้รับ:</span>
              <span className="font-bold text-green-600">{collectAmount} บาท</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>สถานะ:</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span className={collectInfo.canCollect ? "text-green-600 font-medium" : "text-yellow-600"}>
                  {formatTimeRemaining(collectInfo.hoursRemaining)}
                </span>
              </div>
            </div>

            {!collectInfo.canCollect && (
              <div className="mt-2">
                <Progress 
                  value={((4 - collectInfo.hoursRemaining) / 4) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500 text-center mt-1">
                  เก็บเกี่ยวได้ทุก 4 ชั่วโมง
                </div>
              </div>
            )}
          </div>
        </div>

        {/* คำแนะนำ */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">เคล็ดลับ:</p>
              <ul className="space-y-1 text-xs">
                <li>• ให้อาหารเพื่อเพิ่มพลังงาน</li>
                <li>• เล่นเพื่อเพิ่มอารมณ์และประสบการณ์</li>
                <li>• สถานะที่ดีจะให้เครดิตมากขึ้น</li>
                <li>• เลเวลสูงจะได้โบนัสเครดิต</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}