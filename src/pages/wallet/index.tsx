import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>กระเป๋าเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">หน้ากระเป๋าเงิน</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}