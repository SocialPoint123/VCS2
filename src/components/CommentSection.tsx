import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface CommentSectionProps {
  postId: number;
  onUpdate: () => void; // ฟังก์ชันรีเฟรชข้อมูลโพสต์
}

interface Comment {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
  } | null;
}

/**
 * คอมโพเนนท์แสดงและจัดการคอมเมนต์ของโพสต์
 * รองรับการแสดงคอมเมนต์และเพิ่มคอมเมนต์ใหม่
 */
export default function CommentSection({ postId, onUpdate }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ดึงข้อมูลคอมเมนต์ของโพสต์นี้
  const { data: comments, isLoading, refetch } = useQuery<Comment[]>({
    queryKey: [`/api/posts/${postId}/comments`],
  });

  // ฟังก์ชันส่งคอมเมนต์ใหม่ (Mock user ID = 2)
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 2, // Mock user ID - ในการใช้งานจริงควรดึงจาก authentication
          text: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        refetch(); // รีเฟรชคอมเมนต์
        onUpdate(); // อัปเดตจำนวนคอมเมนต์ในโพสต์
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันแสดงเวลาที่ผ่านมา
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: th 
      });
    } catch {
      return "เมื่อสักครู่";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ฟอร์มเพิ่มคอมเมนต์ใหม่ */}
      <div className="flex space-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="เขียนคอมเมนต์..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-3 w-3 mr-1" />
              {isSubmitting ? "กำลังส่ง..." : "ส่ง"}
            </Button>
          </div>
        </div>
      </div>

      {/* รายการคอมเมนต์ */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
                alt="Commenter avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.user?.name || "ผู้ใช้ไม่ระบุชื่อ"}
                  </span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    @{comment.user?.username || "unknown"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">ยังไม่มีคอมเมนต์</p>
            <p className="text-xs">เป็นคนแรกที่แสดงความคิดเห็น</p>
          </div>
        )}
      </div>
    </div>
  );
}