import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Heart, MessageSquare } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function FeedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">ฟีดข่าว</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            สร้างโพสต์
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ยินดีต้อนรับ {user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              ยินดีต้อนรับสู่ BergDotBet B.B - ระบบจัดการแอดมินที่ครบครัน
            </p>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="h-4 w-4" />
                <span>0 ไลค์</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="h-4 w-4" />
                <span>0 คอมเมนต์</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}