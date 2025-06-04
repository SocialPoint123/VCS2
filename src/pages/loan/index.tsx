import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../.././card";
import { Button } from "../.././button";
import { Badge } from "../.././badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../.././tabs";
import LoanForm from "../../components/loan/LoanForm";
import { useUserLoanRequests } from "../../modules/loan/useLoan";
import { ArrowLeft, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

/**
 * หน้าหลักระบบสินเชื่อ
 * แสดงฟอร์มขอสินเชื่อและประวัติคำขอของผู้ใช้
 */
export default function LoanPage() {
  const currentUserId = 2; // Mock user ID
  const [activeTab, setActiveTab] = useState("request");
  
  const { data: userLoans = [], isLoading, refetch } = useUserLoanRequests(currentUserId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "paid":
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "อนุมัติแล้ว";
      case "rejected":
        return "ปฏิเสธ";
      case "paid":
        return "ชำระแล้ว";
      default:
        return "รออนุมัติ";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "paid":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // สถิติสินเชื่อ
  const pendingLoans = userLoans.filter(loan => loan.status === "pending");
  const approvedLoans = userLoans.filter(loan => loan.status === "approved");
  const totalBorrowed = userLoans
    .filter(loan => loan.status === "approved" || loan.status === "paid")
    .reduce((sum, loan) => sum + parseFloat(loan.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/feed">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>กลับไปยัง Feed</span>
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">ระบบสินเชื่อ</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  แชท
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* สถิติภาพรวม */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">รออนุมัติ</p>
                  <p className="text-xl font-bold">{pendingLoans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">อนุมัติแล้ว</p>
                  <p className="text-xl font-bold">{approvedLoans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ยอดกู้รวม</p>
                  <p className="text-xl font-bold">{totalBorrowed.toLocaleString()} ฿</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">ขอสินเชื่อใหม่</TabsTrigger>
            <TabsTrigger value="history">ประวัติคำขอ</TabsTrigger>
          </TabsList>

          {/* ฟอร์มขอสินเชื่อ */}
          <TabsContent value="request" className="mt-6">
            <LoanForm 
              userId={currentUserId} 
              onSuccess={() => {
                refetch();
                setActiveTab("history");
              }} 
            />
          </TabsContent>

          {/* ประวัติคำขอสินเชื่อ */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                  <span>ประวัติคำขอสินเชื่อ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : userLoans.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">ยังไม่มีประวัติการขอสินเชื่อ</p>
                    <Button 
                      onClick={() => setActiveTab("request")}
                      variant="outline"
                    >
                      เริ่มขอสินเชื่อเลย
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userLoans.map((loan) => (
                      <Card key={loan.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(loan.status)}
                              <Badge className={getStatusColor(loan.status)}>
                                {getStatusText(loan.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              #{loan.id}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">จำนวนกู้</p>
                              <p className="font-semibold">{parseFloat(loan.amount).toLocaleString()} ฿</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">ดอกเบี้ย</p>
                              <p className="font-semibold">{loan.interestRate}%/ชม.</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">ยอดรวม</p>
                              <p className="font-semibold text-red-600">
                                {parseFloat(loan.totalAmount).toLocaleString()} ฿
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">วันที่สร้าง</p>
                              <p className="font-semibold">
                                {formatDistanceToNow(new Date(loan.createdAt), { 
                                  addSuffix: true, 
                                  locale: th 
                                })}
                              </p>
                            </div>
                          </div>

                          {loan.dueDate && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500">กำหนดชำระ</p>
                              <p className="text-sm font-medium">
                                {new Date(loan.dueDate).toLocaleString('th-TH')}
                              </p>
                            </div>
                          )}

                          {loan.note && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">หมายเหตุจากแอดมิน</p>
                              <p className="text-sm">{loan.note}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ข้อมูลสำคัญ */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูลสำคัญ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">เงื่อนไขการขอสินเชื่อ</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• บัญชีต้องมีอายุอย่างน้อย 3 วัน</li>
                  <li>• ไม่มีสินเชื่อค้างชำระ</li>
                  <li>• จำนวนขั้นต่ำ 100 บาท</li>
                  <li>• จำนวนสูงสุด 50,000 บาท</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">อัตราดอกเบี้ย</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• อัตราดอกเบี้ย 5% ต่อชั่วโมง</li>
                  <li>• คำนวณแบบทบต้น</li>
                  <li>• การชำระล่าช้ามีค่าปรับเพิ่มเติม</li>
                  <li>• ระยะเวลาชำระ 1-720 ชั่วโมง</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}