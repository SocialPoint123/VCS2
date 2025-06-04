import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function PublicChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>แชทสาธารณะ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">หน้าแชทสาธารณะ</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}