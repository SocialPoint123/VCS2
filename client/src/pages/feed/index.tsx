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
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // ดึงข้อมูลโพสต์ทั้งหมด
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["/api/posts"],
  });

  // จัดการการเลือกไฟล์
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // ฟังก์ชันสร้างโพสต์ใหม่
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append("userId", 2); // Mock user ID
      formData.append("content", newPostContent);
      if (file) {
        formData.append("media", file);
        formData.append("mediaType", "image");
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setNewPostContent("");
        setFile(null);
        setPreviewUrl("");
        setIsCreatePostOpen(false);
        refetch();
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Social Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setIsCreatePostOpen(!isCreatePostOpen)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>

            {isCreatePostOpen && (
              <div className="mt-4 space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md"
                  />
                )}
                <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                  Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}