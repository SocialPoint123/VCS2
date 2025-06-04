import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Link, useLocation } from "wouter";
import { UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

const registerSchema = z.object({
  username: z.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: z.string().min(6, "ยืนยันรหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"]
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [_, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          name: data.name,
          password: data.password
        })
      });
      return response;
    },
    onSuccess: () => {
      setLocation("/");
    }
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">สมัครสมาชิก</CardTitle>
          <p className="text-center text-gray-600">
            สร้างบัญชีใหม่เพื่อเข้าใช้งาน BergDotBet B.B
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อผู้ใช้</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกชื่อผู้ใช้" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="กรอกอีเมล" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกชื่อ-นามสกุล" {...field} />
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
                          placeholder="กรอกรหัสผ่าน"
                          {...field}
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="ยืนยันรหัสผ่าน"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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

              {registerMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {registerMutation.error instanceof Error 
                      ? registerMutation.error.message 
                      : "เกิดข้อผิดพลาดในการสมัครสมาชิก"
                    }
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "กำลังสมัคร..." : "สมัครสมาชิก"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  มีบัญชีแล้ว?{" "}
                  <Link href="/" className="text-blue-600 hover:underline font-medium">
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}