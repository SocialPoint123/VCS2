import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  Plus,
  Minus,
  RefreshCw,
  Calendar,
  User,
  FileText,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { useTransactionHistory } from "../modules/wallet/useWallet";
import type { CreditTransaction } from "../modules/wallet/walletService";

interface CreditHistoryProps {
  userId: number;
}

/**
 * คอมโพเนนท์แสดงประวัติธุรกรรมเครดิต
 * รองรับการแสดงทุกประเภทธุรกรรมพร้อมรายละเอียด
 */
export default function CreditHistory({ userId }: CreditHistoryProps) {
  const { data: transactions, isLoading, error, refetch } = useTransactionHistory(userId);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer_in':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'transfer_out':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'top_up':
      case 'loan_disbursement':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'withdraw':
      case 'loan_payment':
        return <Minus className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    const labels = {
      'transfer_in': 'รับโอน',
      'transfer_out': 'โอนออก',
      'top_up': 'เติมเครดิต',
      'withdraw': 'ถอนเครดิต',
      'loan_disbursement': 'เงินกู้',
      'loan_payment': 'ชำระหนี้',
      'admin_adjustment': 'ปรับปรุงโดยแอดมิน',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'transfer_in':
      case 'top_up':
      case 'loan_disbursement':
        return 'text-green-600';
      case 'transfer_out':
      case 'withdraw':
      case 'loan_payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      'completed': { label: 'สำเร็จ', className: 'bg-green-100 text-green-700' },
      'pending': { label: 'รอดำเนินการ', className: 'bg-yellow-100 text-yellow-700' },
      'rejected': { label: 'ปฏิเสธ', className: 'bg-red-100 text-red-700' },
      'cancelled': { label: 'ยกเลิก', className: 'bg-gray-100 text-gray-700' },
    };
    
    const config = configs[status as keyof typeof configs];
    return config ? (
      <Badge className={config.className}>{config.label}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  const formatAmount = (amount: string, type: string) => {
    const value = parseFloat(amount);
    const formatted = Math.abs(value).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    const isPositive = ['transfer_in', 'top_up', 'loan_disbursement'].includes(type);
    const sign = isPositive ? '+' : '-';
    
    return `${sign}${formatted}`;
  };

  const getOtherUser = (transaction: CreditTransaction) => {
    if (transaction.type === 'transfer_in' && transaction.fromUser) {
      return { user: transaction.fromUser, label: 'จาก' };
    }
    if (transaction.type === 'transfer_out' && transaction.toUser) {
      return { user: transaction.toUser, label: 'ถึง' };
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>ประวัติธุรกรรม</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>ประวัติธุรกรรม</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            เกิดข้อผิดพลาดในการโหลดประวัติธุรกรรม
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>ประวัติธุรกรรม</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ยังไม่มีประวัติธุรกรรม</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // จัดกลุ่มธุรกรรมตามวันที่
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, CreditTransaction[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>ประวัติธุรกรรม</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {transactions.length} รายการ
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date}>
                {/* หัวข้อวันที่ */}
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    {new Date(date).toLocaleDateString('th-TH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* รายการธุรกรรมในวันนั้น */}
                <div className="space-y-3 ml-6">
                  {dayTransactions.map((transaction) => {
                    const otherUser = getOtherUser(transaction);
                    
                    return (
                      <div key={transaction.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          {/* ข้อมูลหลักของธุรกรรม */}
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="p-2 rounded-full bg-gray-100">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">
                                  {getTransactionLabel(transaction.type)}
                                </span>
                                {getStatusBadge(transaction.status)}
                              </div>
                              
                              {/* ข้อมูลผู้ใช้อื่น (สำหรับการโอน) */}
                              {otherUser && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                  <User className="h-3 w-3" />
                                  <span>{otherUser.label} {otherUser.user.name} (@{otherUser.user.username})</span>
                                </div>
                              )}
                              
                              {/* หมายเหตุ */}
                              {transaction.note && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {transaction.note}
                                </p>
                              )}
                              
                              {/* เวลาและยอดคงเหลือ */}
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>
                                  {formatDistanceToNow(new Date(transaction.createdAt), { 
                                    addSuffix: true, 
                                    locale: th 
                                  })}
                                </span>
                                <span>•</span>
                                <span>
                                  ยอดคงเหลือ: {parseFloat(transaction.balanceAfter).toLocaleString()} บาท
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* จำนวนเงิน */}
                          <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                            <div className="text-lg font-bold">
                              {formatAmount(transaction.amount, transaction.type)} บาท
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleTimeString('th-TH')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Object.keys(groupedTransactions).indexOf(date) < Object.keys(groupedTransactions).length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* สรุปสถิติ */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">รายรับ</span>
              </div>
              <div className="text-lg font-bold text-green-700">
                {transactions
                  .filter(t => ['transfer_in', 'top_up', 'loan_disbursement'].includes(t.type))
                  .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
                  .toLocaleString()} บาท
              </div>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">รายจ่าย</span>
              </div>
              <div className="text-lg font-bold text-red-700">
                {transactions
                  .filter(t => ['transfer_out', 'withdraw', 'loan_payment'].includes(t.type))
                  .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
                  .toLocaleString()} บาท
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}