import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";

/**
 * หน้าแสดงโพสต์เดี่ยวตาม ID
 * แสดงโพสต์พร้อมคอมเมนต์ทั้งหมดและสามารถโต้ตอบได้
 */
export default function ViewPostPage() {
  const { id } = useParams();
  const postId = parseInt(id || "0");

  // ดึงข้อมูลโพสต์ทั้งหมดแล้วหาโพสต์ที่ต้องการ
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/posts"],
  });

  // หาโพสต์ที่ต้องการจาก posts array
  const post = posts?.find((p: any) => p.id === postId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/feed">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>กลับไปยัง Feed</span>
              </Button>
            </Link>
          </div>

          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/feed">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>กลับไปยัง Feed</span>
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                ไม่พบโพสต์
              </h2>
              <p className="text-gray-500 mb-6">
                โพสต์ที่คุณกำลังมองหาอาจถูกลบแล้วหรือไม่มีอยู่
              </p>
              <Link href="/feed">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  กลับไปยัง Feed
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/feed">
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
                <span>กลับไปยัง Feed</span>
              </Button>
            </Link>
            <div className="text-sm text-gray-500">
              โพสต์โดย {post.user?.name || "ผู้ใช้ไม่ระบุชื่อ"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Detail */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            รายละเอียดโพสต์
          </h1>
          <p className="text-gray-600">
            โต้ตอบกับโพสต์นี้ ไลค์ ดิสไลค์ หรือเขียนคอมเมนต์
          </p>
        </div>

        {/* Post Card with Comments Always Visible */}
        <div className="space-y-6">
          <PostCard 
            post={post} 
            onUpdate={refetch}
            defaultShowComments={true} // แสดงคอมเมนต์โดยอัตโนมัติ
          />
        </div>

        {/* Additional Post Statistics */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {post.likesCount}
                </div>
                <div className="text-sm text-gray-500">ไลค์</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {post.dislikesCount}
                </div>
                <div className="text-sm text-gray-500">ดิสไลค์</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {post.commentsCount}
                </div>
                <div className="text-sm text-gray-500">คอมเมนต์</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts Section (Future Enhancement) */}
        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">
            ต้องการดูโพสต์อื่นๆ? 
            <Link href="/feed" className="text-blue-500 hover:text-blue-600 ml-1">
              กลับไปยัง Feed
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}