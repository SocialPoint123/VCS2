import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Link, useLocation } from "wouter";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "กรุณาใส่ชื่อผู้ใช้"),
  password: z.string().min(1, "กรุณาใส่รหัสผ่าน"),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * หน้าล็อกอิน
 * รองรับการเข้าสู่ระบบด้วย username/password
 */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ ${data.user.name || data.user.username}`,
      });
      
      // เก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // รีเฟรชหน้าเพื่อโหลดข้อมูลใหม่
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: error.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ</CardTitle>
          <p className="text-gray-600">เข้าสู่ระบบ BergDotBet B.B</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อผู้ใช้</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ใส่ชื่อผู้ใช้"
                        {...field}
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="ใส่รหัสผ่าน"
                          {...field}
                          disabled={loginMutation.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>เข้าสู่ระบบ</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/register">
              <Button variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                สมัครสมาชิกใหม่
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>ต้องการความช่วยเหลือ? ติดต่อแอดมิน</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}