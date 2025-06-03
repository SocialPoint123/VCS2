import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";

/**
 * หน้า Feed หลักสำหรับโซเชียลมีเดีย
 * แสดงโพสต์ทั้งหมดเรียงจากใหม่ไปเก่า พร้อมฟังก์ชันโพสต์ใหม่
 */
export default function FeedPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "link" | "">("");

  // ดึงข้อมูลโพสต์ทั้งหมด
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["/api/posts"],
  });

  // ฟังก์ชันสร้างโพสต์ใหม่ (Mock user ID = 2 สำหรับการทดสอบ)
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 2, // Mock user ID - ในการใช้งานจริงควรดึงจาก authentication
          content: newPostContent,
          mediaUrl: mediaUrl || null,
          mediaType: mediaType || null,
        }),
      });

      if (response.ok) {
        setNewPostContent("");
        setMediaUrl("");
        setMediaType("");
        setIsCreatePostOpen(false);
        refetch(); // รีเฟรชรายการโพสต์
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">BergDotBet Community</h1>
            </div>
            <Button
              onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              โพสต์ใหม่
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Card */}
        {isCreatePostOpen && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">สร้างโพสต์ใหม่</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="แชร์ประสบการณ์หรือเทคนิคการเล่นของคุณ..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL รูปภาพ/วิดีโอ/ลิงก์ (ไม่บังคับ)
                  </label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทสื่อ
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">ไม่มีสื่อ</option>
                    <option value="image">รูปภาพ</option>
                    <option value="video">วิดีโอ</option>
                    <option value="link">ลิงก์</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatePostOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  โพสต์
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} onUpdate={refetch} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ยังไม่มีโพสต์
                </h3>
                <p className="text-gray-500 mb-4">
                  เป็นคนแรกที่แชร์ประสบการณ์ในชุมชน BergDotBet
                </p>
                <Button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  สร้างโพสต์แรก
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}