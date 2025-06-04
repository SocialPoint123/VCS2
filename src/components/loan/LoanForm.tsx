import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Alert, AlertDescription } from "./alert";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { Calculator, Clock, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { useCreateLoan, useLoanEligibility } from "../modules/loan/useLoan";
import { loanService } from "../modules/loan/loanService";

interface LoanFormProps {
  userId: number;
  onSuccess?: () => void;
}

/**
 * คอมโพเนนท์ฟอร์มขอสินเชื่อ
 * รองรับการคำนวณดอกเบี้ยแบบเรียลไทม์และตรวจสอบสิทธิ์
 */
export default function LoanForm({ userId, onSuccess }: LoanFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [hours, setHours] = useState<number>(24);
  const [calculatedInterest, setCalculatedInterest] = useState<number>(0);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  
  const createLoanMutation = useCreateLoan();
  const { data: eligibility, isLoading: checkingEligibility } = useLoanEligibility(userId);

  const interestRatePerHour = 5.0; // 5% ต่อชั่วโมง

  // คำนวณดอกเบี้ยและยอดรวมทันทีเมื่อจำนวนเงินหรือชั่วโมงเปลี่ยน
  useEffect(() => {
    const loanAmount = parseFloat(amount) || 0;
    if (loanAmount > 0) {
      const interest = loanService.calculateInterest(loanAmount, interestRatePerHour, hours);
      const total = loanService.calculateTotalAmount(loanAmount, interestRatePerHour, hours);
      setCalculatedInterest(interest);
      setCalculatedTotal(total);
    } else {
      setCalculatedInterest(0);
      setCalculatedTotal(0);
    }
  }, [amount, hours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loanAmount = parseFloat(amount);
    if (!loanAmount || loanAmount <= 0) {
      return;
    }

    // คำนวณวันที่ครบกำหนดชำระ
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + hours);

    try {
      await createLoanMutation.mutateAsync({
        userId,
        amount: loanAmount.toString(),
        interestRate: interestRatePerHour.toString(),
        totalAmount: calculatedTotal.toString(),
        dueDate: dueDate.toISOString(),
      });

      // รีเซ็ตฟอร์ม
      setAmount("");
      setHours(24);
      onSuccess?.();
    } catch (error) {
      // Error จะถูกจัดการใน mutation hook
    }
  };

  const isEligible = eligibility?.eligible ?? false;
  const loanAmount = parseFloat(amount) || 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>ขอสินเชื่อออนไลน์</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          ระบบสินเชื่อรายชั่วโมง อัตราดอกเบี้ย {interestRatePerHour}% ต่อชั่วโมง
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* สถานะสิทธิ์ */}
        {checkingEligibility ? (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>กำลังตรวจสอบสิทธิ์...</AlertDescription>
          </Alert>
        ) : !isEligible ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              คุณยังไม่มีสิทธิ์ขอสินเชื่อ บัญชีต้องมีอายุอย่างน้อย 3 วันและไม่มีสินเชื่อค้างชำระ
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              คุณมีสิทธิ์ขอสินเชื่อ สามารถกรอกแบบฟอร์มด้านล่างได้
            </AlertDescription>
          </Alert>
        )}

        {isEligible && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* จำนวนเงินขอสินเชื่อ */}
            <div className="space-y-2">
              <Label htmlFor="amount">จำนวนเงินที่ต้องการ (บาท)</Label>
              <Input
                id="amount"
                type="number"
                min="100"
                max="50000"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="เช่น 5000"
                required
              />
              <p className="text-xs text-gray-500">
                ขั้นต่ำ 100 บาท - สูงสุด 50,000 บาท
              </p>
            </div>

            {/* ระยะเวลาชำระ */}
            <div className="space-y-2">
              <Label htmlFor="hours">ระยะเวลาชำระ (ชั่วโมง)</Label>
              <div className="flex space-x-2">
                {[24, 48, 72, 168].map((h) => (
                  <Button
                    key={h}
                    type="button"
                    variant={hours === h ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHours(h)}
                  >
                    {h}h
                    {h === 168 && " (7วัน)"}
                  </Button>
                ))}
              </div>
              <Input
                id="hours"
                type="number"
                min="1"
                max="720"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 24)}
                className="mt-2"
              />
            </div>

            <Separator />

            {/* การคำนวณดอกเบี้ย */}
            {loanAmount > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span>รายละเอียดการคำนวณ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">จำนวนเงินต้น</p>
                      <p className="text-lg font-semibold">{loanAmount.toLocaleString()} บาท</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ระยะเวลา</p>
                      <p className="text-lg font-semibold">{hours} ชั่วโมง</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">อัตราดอกเบี้ยรวม</p>
                      <p className="text-lg font-semibold text-orange-600">
                        {(interestRatePerHour * hours).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ดอกเบี้ย</p>
                      <p className="text-lg font-semibold text-red-600">
                        {calculatedInterest.toLocaleString()} บาท
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">ยอดรวมที่ต้องชำระ</p>
                    <p className="text-2xl font-bold text-green-600">
                      {calculatedTotal.toLocaleString()} บาท
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-500 text-center">
                      ครบกำหนดชำระ: {new Date(Date.now() + hours * 60 * 60 * 1000).toLocaleString('th-TH')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* ปุ่มส่งคำขอ */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!loanAmount || loanAmount < 100 || createLoanMutation.isPending}
              size="lg"
            >
              {createLoanMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>กำลังส่งคำขอ...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>ส่งคำขอสินเชื่อ</span>
                </div>
              )}
            </Button>

            {/* ข้อมูลเพิ่มเติม */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">ข้อกำหนดและเงื่อนไข</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• บัญชีต้องมีอายุอย่างน้อย 3 วัน</li>
                <li>• ไม่มีสินเชื่อค้างชำระ</li>
                <li>• อัตราดอกเบี้ย {interestRatePerHour}% ต่อชั่วโมง</li>
                <li>• การไม่ชำระตามกำหนดจะมีค่าปรับเพิ่มเติม</li>
              </ul>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}