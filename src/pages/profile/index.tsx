import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../.././card";
import { Button } from "../.././button";
import { Skeleton } from "../.././skeleton";
import { Alert, AlertDescription } from "../.././alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../.././tabs";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  MessageCircle, 
  AlertCircle,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import ProfileCard from "../../components/profile/ProfileCard";
import ProfilePostsList from "../../components/profile/ProfilePostsList";
import { useUserProfile } from "../../modules/profile/useProfile";
import { useAdminAuth } from "../../hooks/useAdminAuth";

/**
 * หน้าโปรไฟล์ผู้ใช้
 * แสดงข้อมูลส่วนตัว โพสต์ และฟีเจอร์โอนเครดิต
 */
export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: currentUser } = useAdminAuth();
  const profileUserId = userId ? parseInt(userId) : currentUser?.user?.id;
  
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useUserProfile(profileUserId || 0);

  // ไปยังหน้าแชทส่วนตัว
  const handleChatClick = () => {
    if (profile && currentUser?.user) {
      setLocation(`/chat?type=private&userId=${profile.user.id}`);
    }
  };

  if (!profileUserId) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบก่อน
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Content Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์: {error.message}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/feed">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าฟีด
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ไม่พบข้อมูลผู้ใช้ที่ระบุ
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/feed">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าฟีด
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.user?.id === profile.user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับ
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isOwnProfile ? "โปรไฟล์ของฉัน" : `โปรไฟล์ของ ${profile.user.name}`}
              </h1>
              <p className="text-gray-500">
                @{profile.user.username}
              </p>
            </div>
          </div>

          {/* ปุ่มการดำเนินการ */}
          <div className="flex space-x-2">
            {!isOwnProfile && (
              <Button 
                onClick={handleChatClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                แชท
              </Button>
            )}
            
            {isOwnProfile && (
              <Link href="/loan">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  ขอสินเชื่อ
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* เนื้อหาหลัก */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* คอลัมน์ซ้าย - ข้อมูลโปรไฟล์ */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard 
              profile={profile}
              currentUserId={currentUser?.user?.id || 0}
              onChatClick={handleChatClick}
            />

            {/* สถิติเพิ่มเติม */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>สถิติการใช้งาน</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">จำนวนโพสต์</span>
                  <span className="font-semibold">{profile.postsCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ยอดเครดิต</span>
                  <span className="font-semibold text-green-600">
                    {parseFloat(profile.wallet.balance).toLocaleString()} บาท
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">สถานะ</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    profile.user.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {profile.user.status === 'active' ? 'ใช้งานได้' : 'ระงับการใช้งาน'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* คอลัมน์ขวา - เนื้อหาหลัก */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>ภาพรวม</span>
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>โพสต์</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* ข้อมูลภาพรวม */}
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลทั่วไป</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {profile.postsCount}
                        </div>
                        <div className="text-sm text-blue-800">โพสต์ทั้งหมด</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {parseFloat(profile.wallet.balance).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-800">เครดิตคงเหลือ</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">ข้อมูลบัญชี</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>อีเมล:</span>
                          <span>{profile.user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>สถานะ:</span>
                          <span>{profile.user.status === 'active' ? 'ใช้งานได้' : 'ระงับการใช้งาน'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>สมาชิกเมื่อ:</span>
                          <span>{new Date(profile.user.createdAt).toLocaleDateString('th-TH')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts">
                <ProfilePostsList userId={profile.user.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}