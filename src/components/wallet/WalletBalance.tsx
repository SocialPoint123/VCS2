import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Plus,
  Minus,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { useWallet } from "../modules/wallet/useWallet";

interface WalletBalanceProps {
  userId: number;
  onTopUpClick: () => void;
  onWithdrawClick: () => void;
  onTransferClick: () => void;
}

/**
 * คอมโพเนนท์แสดงยอดเครดิตในกระเป๋าเงิน
 * รองรับการซ่อน/แสดงยอดเงินและปุ่มการดำเนินการ
 */
export default function WalletBalance({ 
  userId, 
  onTopUpClick, 
  onWithdrawClick, 
  onTransferClick 
}: WalletBalanceProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { data: wallet, isLoading, error, refetch } = useWallet(userId);

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getBalanceColor = (balance: string) => {
    const amount = parseFloat(balance);
    if (amount >= 10000) return "text-green-600";
    if (amount >= 1000) return "text-blue-600";
    if (amount >= 100) return "text-yellow-600";
    return "text-red-600";
  };

  const getBalanceStatus = (balance: string) => {
    const amount = parseFloat(balance);
    if (amount >= 10000) return { label: "สูง", color: "bg-green-100 text-green-700" };
    if (amount >= 1000) return { label: "ปานกลาง", color: "bg-blue-100 text-blue-700" };
    if (amount >= 100) return { label: "ต่ำ", color: "bg-yellow-100 text-yellow-700" };
    return { label: "ต่ำมาก", color: "bg-red-100 text-red-700" };
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>กระเป๋าเงิน</span>
            </div>
            <Skeleton className="h-6 w-6 rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Skeleton className="h-10 w-48 mx-auto mb-2" />
            <Skeleton className="h-6 w-24 mx-auto" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <CreditCard className="h-5 w-5" />
            <span>กระเป๋าเงิน</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">ไม่สามารถโหลดข้อมูลกระเป๋าเงินได้</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              ลองใหม่
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-600">
            <CreditCard className="h-5 w-5" />
            <span>กระเป๋าเงิน</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">ไม่พบข้อมูลกระเป๋าเงิน</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const balanceStatus = getBalanceStatus(wallet.balance);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>กระเป๋าเงิน</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={balanceStatus.color}>
              {balanceStatus.label}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-1 h-8 w-8"
            >
              {isBalanceVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="p-1 h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ยอดเครดิต */}
        <div className="text-center">
          <div className="mb-2">
            <span className="text-sm text-gray-600">ยอดเครดิตคงเหลือ</span>
          </div>
          
          {isBalanceVisible ? (
            <div className={`text-4xl font-bold ${getBalanceColor(wallet.balance)}`}>
              {formatBalance(wallet.balance)} บาท
            </div>
          ) : (
            <div className="text-4xl font-bold text-gray-400">
              ••••••• บาท
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            อัปเดตล่าสุด: {new Date(wallet.createdAt).toLocaleString('th-TH')}
          </div>
        </div>

        {/* ปุ่มการดำเนินการ */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTopUpClick}
            className="flex flex-col items-center py-3 h-auto text-green-600 border-green-300 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mb-1" />
            <span className="text-xs">เติมเงิน</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onWithdrawClick}
            className="flex flex-col items-center py-3 h-auto text-red-600 border-red-300 hover:bg-red-50"
            disabled={parseFloat(wallet.balance) <= 0}
          >
            <Minus className="h-4 w-4 mb-1" />
            <span className="text-xs">ถอนเงิน</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onTransferClick}
            className="flex flex-col items-center py-3 h-auto text-blue-600 border-blue-300 hover:bg-blue-50"
            disabled={parseFloat(wallet.balance) <= 0}
          >
            <TrendingUp className="h-4 w-4 mb-1" />
            <span className="text-xs">โอนเงิน</span>
          </Button>
        </div>

        {/* คำเตือนยอดเงินต่ำ */}
        {parseFloat(wallet.balance) < 100 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-yellow-800">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">ยอดเครดิตต่ำ</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              เติมเครดิตเพื่อใช้งานฟีเจอร์ต่างๆ ได้อย่างต่อเนื่อง
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}