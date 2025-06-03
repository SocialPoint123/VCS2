import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/CommentSection";
import { Heart, MessageCircle, ThumbsDown, ThumbsUp, ExternalLink, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface PostCardProps {
  post: {
    id: number;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
      username: string;
    } | null;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
  };
  onUpdate: () => void; // ฟังก์ชันรีเฟรชข้อมูล
}

/**
 * คอมโพเนนท์แสดงโพสต์แต่ละอัน
 * รองรับการแสดงข้อความ รูปภาพ วิดีโอ และลิงก์
 * มีฟีเจอร์ไลค์/ดิสไลค์และคอมเมนต์
 */
export default function PostCard({ post, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // ดึงสถานะไลค์ของผู้ใช้ปัจจุบัน (Mock user ID = 2)
  const currentUserId = 2;
  const { data: userLikeData } = useQuery({
    queryKey: [`/api/posts/${post.id}/like/${currentUserId}`],
  });

  const userLike = userLikeData?.like;

  // ฟังก์ชันจัดการไลค์/ดิสไลค์
  const handleLike = async (type: "like" | "dislike") => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          type,
        }),
      });

      if (response.ok) {
        onUpdate(); // รีเฟรชข้อมูลโพสต์
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
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

  // ฟังก์ชันแสดงสื่อตามประเภท
  const renderMedia = () => {
    if (!post.mediaUrl) return null;

    switch (post.mediaType) {
      case "image":
        return (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full max-h-96 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        );

      case "video":
        return (
          <div className="mt-3 rounded-lg overflow-hidden bg-black">
            <video
              controls
              className="w-full max-h-96"
              poster=""
            >
              <source src={post.mediaUrl} type="video/mp4" />
              เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
            </video>
          </div>
        );

      case "link":
        return (
          <div className="mt-3">
            <a
              href={post.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">
                  ลิงก์ภายนอก
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {post.mediaUrl}
                </p>
              </div>
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header - ข้อมูลผู้โพสต์ */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face`}
            alt="User avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {post.user?.name || "ผู้ใช้ไม่ระบุชื่อ"}
              </h3>
              <Badge variant="secondary" className="text-xs">
                @{post.user?.username || "unknown"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {getTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* เนื้อหาโพสต์ */}
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
          {renderMedia()}
        </div>

        {/* ปุ่มอินเตอร์แอคชัน */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* ปุ่มไลค์ */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike("like")}
              disabled={isLiking}
              className={`flex items-center space-x-1 ${
                userLike?.type === "like" 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${userLike?.type === "like" ? "fill-current" : ""}`} />
              <span>{post.likesCount}</span>
            </Button>

            {/* ปุ่มดิสไลค์ */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike("dislike")}
              disabled={isLiking}
              className={`flex items-center space-x-1 ${
                userLike?.type === "dislike" 
                  ? "text-blue-500 hover:text-blue-600" 
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <ThumbsDown className={`h-4 w-4 ${userLike?.type === "dislike" ? "fill-current" : ""}`} />
              <span>{post.dislikesCount}</span>
            </Button>

            {/* ปุ่มคอมเมนต์ */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentsCount}</span>
            </Button>
          </div>

          {/* สถิติการมีส่วนร่วม */}
          <div className="text-xs text-gray-400">
            {post.likesCount + post.dislikesCount > 0 && (
              <span>
                {post.likesCount + post.dislikesCount + post.commentsCount} การมีส่วนร่วม
              </span>
            )}
          </div>
        </div>

        {/* ส่วนคอมเมนต์ */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CommentSection postId={post.id} onUpdate={onUpdate} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}