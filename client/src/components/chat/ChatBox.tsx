import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import Message from "./Message";
import { useSendMessage } from "@/modules/chat/useChat";
import type { ChatMessage } from "@/modules/chat/chatService";

interface ChatBoxProps {
  messages: ChatMessage[];
  currentUserId: number;
  isLoading?: boolean;
  onSendMessage: (message: string) => void;
  title: string;
  placeholder?: string;
  isPublicChat?: boolean;
}

/**
 * คอมโพเนนท์หลักสำหรับแสดงและส่งข้อความแชท
 * รองรับทั้งแชทส่วนตัวและโถงแชทสาธารณะ
 */
export default function ChatBox({ 
  messages, 
  currentUserId, 
  isLoading = false,
  onSendMessage,
  title,
  placeholder = "พิมพ์ข้อความ...",
  isPublicChat = false
}: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendMessage();

  // เลื่อนไปข้อความล่าสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendMessageMutation.isPending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    onSendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {isPublicChat && (
          <p className="text-sm text-gray-500">
            โถงแชทสาธารณะ - ทุกคนสามารถเห็นข้อความได้
          </p>
        )}
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 px-4 pb-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">กำลังโหลดข้อความ...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>ยังไม่มีข้อความ</p>
              <p className="text-sm">เริ่มต้นการสนทนากันเลย!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  currentUserId={currentUserId}
                  isPublicChat={isPublicChat}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              size="sm"
              className="px-3"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {sendMessageMutation.isPending && (
            <p className="text-xs text-gray-500 mt-1">กำลังส่งข้อความ...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}