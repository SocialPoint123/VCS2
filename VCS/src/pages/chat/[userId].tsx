import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function PrivateChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>แชทส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">หน้าแชทส่วนตัว</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}