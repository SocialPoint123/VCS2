import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";
import { 
  Send, 
  Search, 
  User, 
  CheckCircle, 
  AlertCircle,
  X
} from "lucide-react";
import { useTransferCredits, useSearchUsers } from "../modules/wallet/useWallet";

interface TransferFormProps {
  fromUserId: number;
  currentBalance: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * คอมโพเนนท์ฟอร์มโอนเครดิต
 * รองรับการค้นหาผู้ใช้และโอนเครดิตพร้อมการตรวจสอบ
 */
export default function TransferForm({ fromUserId, currentBalance, onSuccess, onCancel }: TransferFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; username: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  
  const transferMutation = useTransferCredits();
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(searchQuery);
  
  const maxAmount = parseFloat(currentBalance);
  const transferAmount = parseFloat(amount) || 0;
  const isValidAmount = transferAmount > 0 && transferAmount <= maxAmount;
  const isValidTransfer = selectedUser && isValidAmount && !transferMutation.isPending;

  const handleTransfer = async () => {
    if (!isValidTransfer) return;

    try {
      await transferMutation.mutateAsync({
        fromUserId,
        toUserId: selectedUser.id,
        amount: transferAmount.toString(),
        note: note.trim() || undefined,
      });
      
      // รีเซ็ตฟอร์ม
      setSelectedUser(null);
      setAmount("");
      setNote("");
      setSearchQuery("");
      
      onSuccess();
    } catch (error) {
      // Error จัดการใน mutation hook
    }
  };

  const handleUserSelect = (user: { id: number; name: string; username: string }) => {
    setSelectedUser(user);
    setSearchQuery("");
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0" : num.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>โอนเครดิต</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ยอดเงินปัจจุบัน */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm text-blue-600 mb-1">ยอดเครดิตคงเหลือ</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(currentBalance)} บาท
            </p>
          </div>
        </div>

        {/* เลือกผู้รับ */}
        <div>
          <Label htmlFor="recipient">ผู้รับเครดิต</Label>
          {selectedUser ? (
            <div className="mt-2">
              <div className="flex items-center justify-between p-3 border border-green-300 rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-green-600 text-white">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                  className="text-green-600 hover:text-green-700"
                >
                  เปลี่ยน
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="recipient"
                  placeholder="ค้นหาชื่อหรือ username ผู้ใช้..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* ผลการค้นหา */}
              {searchQuery.length >= 2 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left"
                          disabled={user.id === fromUserId}
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">@{user.username}</p>
                          </div>
                          {user.id === fromUserId && (
                            <Badge variant="secondary">ตัวคุณ</Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>ไม่พบผู้ใช้</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* จำนวนเครดิต */}
        <div>
          <Label htmlFor="amount">จำนวนเครดิต (บาท)</Label>
          <div className="mt-2">
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="เช่น 1000"
              className={transferAmount > maxAmount ? "border-red-300" : ""}
            />
            {transferAmount > maxAmount && (
              <p className="text-sm text-red-600 mt-1">
                จำนวนเครดิตเกินยอดคงเหลือ
              </p>
            )}
          </div>
          
          {/* ปุ่มจำนวนเงินที่ใช้บ่อย */}
          <div className="flex space-x-2 mt-2">
            {[100, 500, 1000, maxAmount / 2, maxAmount].map((preset, index) => {
              if (preset <= 0 || preset > maxAmount) return null;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className="text-xs"
                >
                  {preset === maxAmount ? "ทั้งหมด" : formatCurrency(preset.toString())}
                </Button>
              );
            })}
          </div>
        </div>

        {/* หมายเหตุ */}
        <div>
          <Label htmlFor="note">หมายเหตุ (ไม่บังคับ)</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ระบุเหตุผลการโอน..."
            rows={3}
            className="mt-2"
          />
        </div>

        {/* สรุปการโอน */}
        {selectedUser && transferAmount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 space-y-1">
                <p className="font-semibold">สรุปการโอน</p>
                <div className="space-y-1">
                  <p>• จำนวน: {formatCurrency(amount)} บาท</p>
                  <p>• ผู้รับ: {selectedUser.name} (@{selectedUser.username})</p>
                  <p>• ยอดคงเหลือหลังโอน: {formatCurrency((maxAmount - transferAmount).toString())} บาท</p>
                  {note && <p>• หมายเหตุ: {note}</p>}
                </div>
                <div className="flex items-center space-x-1 text-xs text-yellow-700 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>การโอนจะไม่สามารถยกเลิกได้</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ปุ่มดำเนินการ */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={transferMutation.isPending}
          >
            ยกเลิก
          </Button>
          
          <Button
            className="flex-1"
            onClick={handleTransfer}
            disabled={!isValidTransfer}
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
      </CardContent>
    </Card>
  );
}