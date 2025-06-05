import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService, type CreatePostData, type CreateCommentData } from "./postService";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hooks สำหรับจัดการโพสต์โซเชียลมีเดีย
 * ใช้ React Query สำหรับ state management และ caching
 */

// Hook สำหรับดึงโพสต์ทั้งหมด
export function usePosts() {
  return useQuery({
    queryKey: ["/api/posts"],
    queryFn: () => postService.getAllPosts(),
    staleTime: 30 * 1000, // Cache เป็นเวลา 30 วินาที
  });
}

// Hook สำหรับสร้างโพสต์ใหม่
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (postData: CreatePostData) => postService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "สำเร็จ",
        description: "โพสต์ใหม่ถูกสร้างแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างโพสต์ได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับดึงคอมเมนต์
export function usePostComments(postId: number) {
  return useQuery({
    queryKey: [`/api/posts/${postId}/comments`],
    queryFn: () => postService.getPostComments(postId),
    staleTime: 60 * 1000, // Cache เป็นเวลา 1 นาที
  });
}

// Hook สำหรับสร้างคอมเมนต์ใหม่
export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (commentData: CreateCommentData) => 
      postService.createComment(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "สำเร็จ",
        description: "คอมเมนต์ถูกเพิ่มแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มคอมเมนต์ได้",
        variant: "destructive",
      });
    },
  });
}

// Hook สำหรับไลค์/ดิสไลค์
export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, type }: { userId: number; type: "like" | "dislike" }) =>
      postService.toggleLike(postId, userId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/like`] });
    },
  });
}

// Hook สำหรับดึงสถานะไลค์ของผู้ใช้
export function useUserLike(postId: number, userId: number) {
  return useQuery({
    queryKey: [`/api/posts/${postId}/like/${userId}`],
    queryFn: () => postService.getUserLike(postId, userId),
    staleTime: 5 * 60 * 1000, // Cache เป็นเวลา 5 นาที
  });
}