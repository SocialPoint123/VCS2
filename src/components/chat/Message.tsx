import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { Avatar, AvatarFallback } from "./avatar";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import type { ChatMessage } from "../modules/chat/chatService";

interface MessageProps {
  message: ChatMessage;
  currentUserId: number;
  isPublicChat?: boolean;
}

/**
 * คอมโพเนนท์แสดงข้อความแชทแต่ละข้อ
 * รองรับทั้งแชทส่วนตัวและแชทสาธารณะ
 */
export default function Message({ message, currentUserId, isPublicChat = false }: MessageProps) {
  const isOwnMessage = message.fromUserId === currentUserId;
  const fromUser = message.fromUser;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar ผู้ส่ง (แสดงเฉพาะในแชทสาธารณะหรือข้อความจากคนอื่น) */}
        {(isPublicChat || !isOwnMessage) && (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
              {fromUser?.name?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
          {/* ชื่อผู้ส่ง (แสดงในแชทสาธารณะ) */}
          {isPublicChat && !isOwnMessage && (
            <div className="text-xs text-gray-500 mb-1 px-2">
              {fromUser?.name || "ผู้ใช้ไม่ระบุชื่อ"}
            </div>
          )}

          {/* ข้อความ */}
          <Card className={`${
            isOwnMessage 
              ? "bg-blue-500 text-white border-blue-500" 
              : "bg-white border-gray-200"
          }`}>
            <CardContent className="px-3 py-2">
              <p className="text-sm break-words">{message.message}</p>
              
              {/* เวลาและสถานะการอ่าน */}
              <div className={`flex items-center justify-between mt-2 text-xs ${
                isOwnMessage ? "text-blue-100" : "text-gray-400"
              }`}>
                <span>
                  {formatDistanceToNow(new Date(message.createdAt), { 
                    addSuffix: true, 
                    locale: th 
                  })}
                </span>
                
                {/* สถานะการอ่าน (เฉพาะข้อความของเราในแชทส่วนตัว) */}
                {!isPublicChat && isOwnMessage && (
                  <Badge variant={message.isRead ? "default" : "secondary"} className="text-xs px-1">
                    {message.isRead ? "อ่านแล้ว" : "ส่งแล้ว"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar ตัวเอง (แสดงเฉพาะในแชทสาธารณะ) */}
        {isPublicChat && isOwnMessage && (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-green-100 text-green-600">
              คุณ
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}