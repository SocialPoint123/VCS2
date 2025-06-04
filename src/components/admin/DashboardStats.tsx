import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, CreditCard, TrendingUp, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "ผู้ใช้ออนไลน์",
      value: stats?.onlineUsers || 0,
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "เครดิตรวม",
      value: stats?.totalCredits || "0",
      icon: CreditCard,
      color: "text-yellow-600"
    },
    {
      title: "ธุรกรรมวันนี้",
      value: stats?.todayTransactions || 0,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}