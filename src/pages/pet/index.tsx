import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function PetPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>สัตว์เลี้ยง</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">หน้าสัตว์เลี้ยง</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}