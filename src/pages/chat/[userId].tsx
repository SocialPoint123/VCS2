import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../.././card";
import { Button } from "../.././button";
import { Avatar, AvatarFallback } from "../.././avatar";
import { Badge } from "../.././badge";
import ChatBox from "../../components/chat/ChatBox";
import { usePrivateMessages, useSendMessage } from "../../modules/chat/useChat";
import { ArrowLeft, MessageSquare, User, Crown } from "lucide-react";

/**
 * หน้าแชทส่วนตัวระหว่างผู้ใช้สองคน
 * แสดงประวัติการสนทนาและรองรับการส่งข้อความแบบเรียลไทม์
 */
export default function PrivateChatPage() {
  const { userId } = useParams();
  const targetUserId = parseInt(userId || "0");
  const currentUserId = 2; // Mock user ID

  // ดึงข้อมูลผู้ใช้เป้าหมาย
  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const targetUser = users?.find((u: any) => u.id === targetUserId);

  // ดึงข้อความแชทส่วนตัว
  const { data: messages = [], isLoading, refetch } = usePrivateMessages(currentUserId, targetUserId);
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async (messageText: string) => {
    try {
      await sendMessageMutation.mutateAsync({
        fromUserId: currentUserId,
        toUserId: targetUserId,
        message: messageText,
        messageType: "text",
      });
      refetch();
    } catch (error) {
      console.error("Error sending private message:", error);
    }
  };

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่พบผู้ใช้
            </h2>
            <p className="text-gray-500 mb-6">
              ผู้ใช้ที่คุณกำลังมองหาไม่มีอยู่ในระบบ
            </p>
            <Link href="/chat">
              <Button className="bg-blue-500 hover:bg-blue-600">
                กลับไปยังโถงแชท
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chat">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>กลับไปยังโถงแชท</span>
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {targetUser.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{targetUser.name}</h1>
                  <p className="text-sm text-gray-500">@{targetUser.username}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  ออนไลน์
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/feed">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div style={{ height: "calc(100vh - 200px)" }}>
              <ChatBox
                messages={messages}
                currentUserId={currentUserId}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                title={`💬 แชทกับ ${targetUser.name}`}
                placeholder={`พิมพ์ข้อความถึง ${targetUser.name}...`}
                isPublicChat={false}
              />
            </div>
          </div>

          {/* User Info Sidebar */}
          <div className="space-y-4">
            {/* User Profile */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">ข้อมูลผู้ใช้</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center space-y-3">
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {targetUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{targetUser.name}</h3>
                    <p className="text-sm text-gray-500">@{targetUser.username}</p>
                    <p className="text-xs text-gray-400">{targetUser.email}</p>
                  </div>
                  <div className="flex justify-center">
                    <Badge 
                      variant={targetUser.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {targetUser.status === 'active' ? 'ใช้งานได้' : 'ระงับ'}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600">ยอดเครดิต</p>
                    <p className="font-semibold text-green-600">{targetUser.creditBalance} บาท</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">การดำเนินการ</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Crown className="h-4 w-4 mr-2" />
                  ดูโปรไฟล์
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  ประวัติแชท
                </Button>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">เมนูด่วน</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Link href="/chat" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Crown className="h-4 w-4 mr-2" />
                    โถงแชทสาธารณะ
                  </Button>
                </Link>
                <Link href="/admin" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}