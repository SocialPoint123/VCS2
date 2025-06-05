import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  DollarSign, 
  Calendar, 
  Mail, 
  MessageCircle, 
  Send,
  CreditCard,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { useTransferCredits, useLoanEligibility } from "@/modules/profile/useProfile";
import type { UserProfile } from "@/modules/profile/profileService";

interface ProfileCardProps {
  profile: UserProfile;
  currentUserId: number;
  onChatClick?: () => void;
}

/**
 * คอมโพเนนท์แสดงข้อมูลโปรไฟล์ผู้ใช้
 * รองรับการโอนเครดิตและแชทส่วนตัว
 */
export default function ProfileCard({ profile, currentUserId, onChatClick }: ProfileCardProps) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  
  const transferMutation = useTransferCredits();
  const { data: eligibility } = useLoanEligibility(currentUserId);

  const { user, wallet, postsCount } = profile;
  const isOwnProfile = user.id === currentUserId;
  const canTransfer = !isOwnProfile && eligibility?.eligible && parseFloat(wallet.balance) > 0;

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) return;

    try {
      await transferMutation.mutateAsync({
        fromUserId: currentUserId,
        toUserId: user.id,
        amount: amount.toString(),
        note: transferNote.trim() || undefined,
      });

      setTransferAmount("");
      setTransferNote("");
      setIsTransferDialogOpen(false);
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "ใช้งานได้";
      case "suspended":
        return "ระงับการใช้งาน";
      default:
        return status;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* ชื่อและ Username */}
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
            <p className="text-gray-500">@{user.username}</p>
            <Badge className={getStatusColor(user.status)}>
              {getStatusText(user.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ข้อมูลพื้นฐาน */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span className="text-sm">{user.email}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm">
              สมาชิกเมื่อ {formatDistanceToNow(new Date(user.createdAt), { 
                addSuffix: true, 
                locale: th 
              })}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-sm">{postsCount} โพสต์</span>
          </div>
        </div>

        <Separator />

        {/* ข้อมูลเครดิต */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="font-semibold">ยอดเครดิต</span>
            </div>
            {!isOwnProfile && canTransfer && (
              <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    โอน
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
          
          <div className="text-3xl font-bold text-green-600">
            {parseFloat(wallet.balance).toLocaleString()} บาท
          </div>
          
          {isOwnProfile && !eligibility?.eligible && (
            <p className="text-xs text-gray-500 mt-2">
              * บัญชีต้องมีอายุ 3 วัน เพื่อปลดล็อกการโอนเครดิต
            </p>
          )}
        </div>

        {/* ปุ่มการดำเนินการ */}
        {!isOwnProfile && (
          <div className="flex space-x-2">
            <Button 
              onClick={onChatClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              แชทส่วนตัว
            </Button>
          </div>
        )}

        {/* Dialog สำหรับโอนเครดิต */}
        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>โอนเครดิตให้ {user.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">จำนวนเครดิต (บาท)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="เช่น 100"
                />
              </div>

              <div>
                <Label htmlFor="note">หมายเหตุ (ไม่บังคับ)</Label>
                <Textarea
                  id="note"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="ระบุเหตุผลการโอน..."
                  rows={3}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">ข้อมูลการโอน</p>
                    <p>• จำนวน: {transferAmount ? parseFloat(transferAmount).toLocaleString() : '0'} บาท</p>
                    <p>• ผู้รับ: {user.name} (@{user.username})</p>
                    <p>• การโอนจะไม่สามารถยกเลิกได้</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsTransferDialogOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleTransfer}
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0 || transferMutation.isPending}
                >
                  {transferMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>กำลังโอน...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>ยืนยันโอน</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}