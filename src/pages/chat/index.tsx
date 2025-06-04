import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../.././card";
import { Button } from "../.././button";
import { Badge } from "../.././badge";
import ChatBox from "../components/chat/ChatBox";
import { usePublicMessages, useSendMessage } from "../../modules/chat/useChat";
import { MessageSquare, Users, Crown, Settings } from "lucide-react";

/**
 * หน้าโถงแชทสาธารณะ
 * ผู้ใช้ทุกคนสามารถเข้ามาแชทและเห็นข้อความของกันและกันได้
 */
export default function PublicChatPage() {
  const currentUserId = 2; // Mock user ID
  const roomId = "public"; // โถงแชทสาธารณะ
  
  const { data: messages = [], isLoading, refetch } = usePublicMessages(roomId);
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async (messageText: string) => {
    try {
      await sendMessageMutation.mutateAsync({
        fromUserId: currentUserId,
        roomId,
        message: messageText,
        messageType: "text",
      });
      refetch(); // รีเฟรชข้อความหลังส่งเสร็จ
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/feed">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>กลับไปยัง Feed</span>
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h1 className="text-xl font-bold text-gray-900">โถงแชทสาธารณะ</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Users className="h-3 w-3 mr-1" />
                  ออนไลน์
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/chat/private">
                <Button variant="outline" size="sm">
                  แชทส่วนตัว
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div style={{ height: "calc(100vh - 200px)" }}>
              <ChatBox
                messages={messages}
                currentUserId={currentUserId}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                title="💬 แชทสาธารณะ"
                placeholder="พิมพ์ข้อความถึงทุกคน..."
                isPublicChat={true}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Online Users */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  ผู้ใช้ออนไลน์
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">คุณ</span>
                    <Badge variant="secondary" className="text-xs">ออนไลน์</Badge>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Admin</span>
                    <Badge variant="secondary" className="text-xs">ออนไลน์</Badge>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">BergDotBet</span>
                    <Badge variant="secondary" className="text-xs">ออนไลน์</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Rules */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">กฎของโถงแชท</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• ใช้ภาษาที่สุภาพ</p>
                  <p>• ไม่โพสต์เนื้อหาที่ไม่เหมาะสม</p>
                  <p>• เคารพผู้อื่น</p>
                  <p>• ไม่ส่งสแปม</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">เมนูด่วน</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Link href="/admin" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
                <Link href="/feed" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Social Feed
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