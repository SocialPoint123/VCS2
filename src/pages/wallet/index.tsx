import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Send,
  Wallet,
  History,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import WalletBalance from "../../components/wallet/WalletBalance";
import CreditHistory from "../../components/wallet/CreditHistory";
import TransferForm from "../../components/wallet/TransferForm";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useWallet, useTopUpRequest, useWithdrawRequest } from "../../modules/wallet/useWallet";

/**
 * หน้ากระเป๋าเงินหลัก
 * รวมการแสดงยอดเครดิต ประวัติธุรกรรม และฟีเจอร์การเงิน
 */
export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("balance");
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  
  // Form states
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpNote, setTopUpNote] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");

  const { data: currentUser } = useAdminAuth();
  const userId = currentUser?.user?.id || 0;
  
  const { data: wallet } = useWallet(userId);
  const topUpMutation = useTopUpRequest();
  const withdrawMutation = useWithdrawRequest();

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) return;

    try {
      await topUpMutation.mutateAsync({
        userId,
        amount: amount.toString(),
        note: topUpNote.trim() || undefined,
      });

      setTopUpAmount("");
      setTopUpNote("");
      setIsTopUpDialogOpen(false);
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return;

    try {
      await withdrawMutation.mutateAsync({
        userId,
        amount: amount.toString(),
        note: withdrawNote.trim() || undefined,
      });

      setWithdrawAmount("");
      setWithdrawNote("");
      setIsWithdrawDialogOpen(false);
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const handleTransferSuccess = () => {
    setIsTransferDialogOpen(false);
  };

  if (!currentUser?.user) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            กรุณาเข้าสู่ระบบเพื่อใช้งานกระเป๋าเงิน
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentBalance = wallet?.balance || "0";
  const maxWithdraw = parseFloat(currentBalance);

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
                <Wallet className="h-6 w-6" />
                <span>กระเป๋าเงิน</span>
              </h1>
              <p className="text-gray-500">จัดการเครดิตและธุรกรรมของคุณ</p>
            </div>
          </div>
        </div>

        {/* เนื้อหาหลัก */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* คอลัมน์ซ้าย - ยอดเครดิต */}
          <div className="lg:col-span-1 space-y-6">
            <WalletBalance
              userId={userId}
              onTopUpClick={() => setIsTopUpDialogOpen(true)}
              onWithdrawClick={() => setIsWithdrawDialogOpen(true)}
              onTransferClick={() => setIsTransferDialogOpen(true)}
            />

            {/* สรุปการใช้งาน */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>การใช้งาน</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {parseFloat(currentBalance).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-800">บาท</div>
                    <div className="text-xs text-blue-600 mt-1">ยอดคงเหลือ</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• เติมเครดิต: ต้องรอการอนุมัติ</p>
                      <p>• ถอนเครดิต: ต้องรอการอนุมัติ</p>
                      <p>• โอนเครดิต: ทันที (ผู้ที่ปลดล็อกแล้ว)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* คอลัมน์ขวา - แท็บเนื้อหา */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="balance" className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span>ภาพรวม</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>ประวัติธุรกรรม</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="balance" className="space-y-6">
                {/* ข้อมูลภาพรวม */}
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลกระเป๋าเงิน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {parseFloat(currentBalance).toLocaleString()} บาท
                            </div>
                            <div className="text-sm text-green-800">ยอดเครดิตคงเหลือ</div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-2">
                          <p><strong>หมายเลขบัญชี:</strong> {userId.toString().padStart(8, '0')}</p>
                          <p><strong>ชื่อบัญชี:</strong> {currentUser.user.name}</p>
                          <p><strong>สถานะ:</strong> 
                            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              ใช้งานได้
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">ฟีเจอร์ที่ใช้ได้</h4>
                          <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>ดูยอดเครดิตและประวัติ</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>ขอเติมเครดิต (รอการอนุมัติ)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>ขอถอนเครดิต (รอการอนุมัติ)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>โอนเครดิตให้ผู้ใช้อื่น</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <CreditHistory userId={userId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Dialog สำหรับเติมเครดิต */}
        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>ขอเติมเครดิต</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="topup-amount">จำนวนเครดิต (บาท)</Label>
                <Input
                  id="topup-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="เช่น 1000"
                />
              </div>

              <div>
                <Label htmlFor="topup-note">หมายเหตุ (ไม่บังคับ)</Label>
                <Textarea
                  id="topup-note"
                  value={topUpNote}
                  onChange={(e) => setTopUpNote(e.target.value)}
                  placeholder="ระบุเหตุผลการเติมเครดิต..."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  คำขอเติมเครดิตจะต้องรอการอนุมัติจากผู้ดูแลระบบก่อน
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsTopUpDialogOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleTopUp}
                  disabled={!topUpAmount || parseFloat(topUpAmount) <= 0 || topUpMutation.isPending}
                >
                  {topUpMutation.isPending ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog สำหรับถอนเครดิต */}
        <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Minus className="h-5 w-5" />
                <span>ขอถอนเครดิต</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="withdraw-amount">จำนวนเครดิต (บาท)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={maxWithdraw}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="เช่น 500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ยอดคงเหลือ: {parseFloat(currentBalance).toLocaleString()} บาท
                </p>
              </div>

              <div>
                <Label htmlFor="withdraw-note">หมายเหตุ (ไม่บังคับ)</Label>
                <Textarea
                  id="withdraw-note"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  placeholder="ระบุเหตุผลการถอนเครดิต..."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  คำขอถอนเครดิตจะต้องรอการอนุมัติจากผู้ดูแลระบบก่อน
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWithdrawDialogOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > maxWithdraw || withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog สำหรับโอนเครดิต */}
        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogContent className="max-w-2xl">
            <TransferForm
              fromUserId={userId}
              currentBalance={currentBalance}
              onSuccess={handleTransferSuccess}
              onCancel={() => setIsTransferDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}