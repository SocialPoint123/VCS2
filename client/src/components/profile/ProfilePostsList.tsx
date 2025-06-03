import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar,
  FileText,
  Image,
  Video,
  Link2,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { Link } from "wouter";
import { useUserPosts } from "@/modules/profile/useProfile";
import type { UserPost } from "@/modules/profile/profileService";

interface ProfilePostsListProps {
  userId: number;
}

/**
 * คอมโพเนนท์แสดงรายการโพสต์ของผู้ใช้ในหน้าโปรไฟล์
 * รองรับการแสดงโพสต์ทุกประเภทและสถิติ
 */
export default function ProfilePostsList({ userId }: ProfilePostsListProps) {
  const { data: posts, isLoading, error } = useUserPosts(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>โพสต์ล่าสุด</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>โพสต์ล่าสุด</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            เกิดข้อผิดพลาดในการโหลดโพสต์
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>โพสต์ล่าสุด</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ยังไม่มีโพสต์</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMediaIcon = (mediaType?: string) => {
    if (!mediaType) return null;
    
    switch (mediaType) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      case 'link':
        return <Link2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getMediaBadge = (mediaType?: string) => {
    if (!mediaType) return null;
    
    const configs = {
      image: { label: "รูปภาพ", className: "bg-blue-100 text-blue-700" },
      video: { label: "วิดีโอ", className: "bg-purple-100 text-purple-700" },
      link: { label: "ลิงก์", className: "bg-green-100 text-green-700" },
    };
    
    const config = configs[mediaType as keyof typeof configs];
    if (!config) return null;
    
    return (
      <Badge variant="secondary" className={config.className}>
        {getMediaIcon(mediaType)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>โพสต์ล่าสุด</span>
          </div>
          <Badge variant="secondary">
            {posts.length} โพสต์
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
            {/* เนื้อหาโพสต์ */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <p className="text-gray-800 flex-1 leading-relaxed">
                  {truncateContent(post.content)}
                </p>
                {post.mediaType && (
                  <div className="ml-3">
                    {getMediaBadge(post.mediaType)}
                  </div>
                )}
              </div>

              {/* แสดงสื่อ (ถ้ามี) */}
              {post.mediaUrl && post.mediaType === 'image' && (
                <div className="mt-3">
                  <img 
                    src={post.mediaUrl} 
                    alt="รูปภาพโพสต์"
                    className="rounded-lg max-w-full h-auto max-h-64 object-cover border border-gray-200"
                    loading="lazy"
                  />
                </div>
              )}

              {post.mediaUrl && post.mediaType === 'video' && (
                <div className="mt-3">
                  <video 
                    src={post.mediaUrl} 
                    controls
                    className="rounded-lg max-w-full h-auto max-h-64 border border-gray-200"
                  >
                    เบราว์เซอร์ไม่รองรับการเล่นวิดีโอ
                  </video>
                </div>
              )}

              {post.mediaUrl && post.mediaType === 'link' && (
                <div className="mt-3">
                  <a 
                    href={post.mediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>ดูลิงก์</span>
                  </a>
                </div>
              )}
            </div>

            {/* ข้อมูลเวลาและสถิติ */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { 
                    addSuffix: true, 
                    locale: th 
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span>{post.likesCount}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  <span>{post.dislikesCount}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>
            </div>

            {/* ปุ่มดูโพสต์เต็ม */}
            <div className="mt-4">
              <Link href={`/post/${post.id}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  ดูโพสต์เต็ม
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {/* ปุ่มดูโพสต์ทั้งหมด (ถ้ามีมากกว่าที่แสดง) */}
        {posts.length >= 20 && (
          <div className="text-center pt-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              ดูโพสต์เพิ่มเติม
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}