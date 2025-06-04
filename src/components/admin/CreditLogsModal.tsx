import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Badge } from "./badge";

interface CreditTransaction {
  id: number;
  fromUserId: number | null;
  toUserId: number | null;
  amount: string;
  type: string;
  status: string;
  note: string;
  balanceAfter: string;
  createdAt: string;
}

interface CreditLogsModalProps {
  userId: number;
  onClose: () => void;
}

export default function CreditLogsModal({ userId, onClose }: CreditLogsModalProps) {
  const { data: transactions, isLoading } = useQuery<CreditTransaction[]>({
    queryKey: [`/api/admin/users/${userId}/credit-transactions`],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const user = users?.find((u: any) => u.id === userId);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      deposit: { label: "ฝากเงิน", className: "bg-green-100 text-green-800" },
      withdrawal: { label: "ถอนเงิน", className: "bg-red-100 text-red-800" },
      game_win: { label: "ชนะเกม", className: "bg-green-100 text-green-800" },
      game_loss: { label: "เล่นเกม", className: "bg-red-100 text-red-800" },
      bonus: { label: "โบนัส", className: "bg-blue-100 text-blue-800" },
      transfer: { label: "โอนเงิน", className: "bg-purple-100 text-purple-800" },
    };

    const config = typeMap[type] || { label: type, className: "bg-gray-100 text-gray-800" };
    
    return (
      <Badge className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getAmountDisplay = (transaction: CreditTransaction) => {
    const isIncoming = transaction.toUserId === userId;
    const amount = parseFloat(transaction.amount);
    const sign = isIncoming ? "+" : "-";
    const colorClass = isIncoming ? "text-green-600" : "text-red-600";
    
    return (
      <span className={`text-sm font-medium ${colorClass}`}>
        {sign}₿{amount.toFixed(2)}
      </span>
    );
  };

  const getFromToDisplay = (transaction: CreditTransaction) => {
    const typeMap: Record<string, string> = {
      deposit: "ระบบฝากเงิน",
      withdrawal: "ระบบถอนเงิน",
      game_win: "เกมสล็อต",
      game_loss: "เกมบาคาร่า",
      bonus: "ระบบโบนัส",
      transfer: "ผู้ใช้อื่น",
    };

    return typeMap[transaction.type] || "ระบบ";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">ประวัติการเคลื่อนไหวเครดิต</DialogTitle>
        </DialogHeader>
        
        {user && (
          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
                alt="User avatar"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm font-medium text-gray-900">เครดิตคงเหลือ: ₿{user.creditBalance}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่และเวลา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จาก/ไป
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คงเหลือหลังธุรกรรม
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมายเหตุ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions?.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(transaction.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAmountDisplay(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getFromToDisplay(transaction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₿{transaction.balanceAfter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
