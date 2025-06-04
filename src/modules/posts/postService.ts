import { apiRequest } from "../../lib/queryClient";

/**
 * Service สำหรับจัดการโพสต์โซเชียลมีเดีย
 * ครอบคลุมการสร้าง อ่าน และจัดการไลค์/คอมเมนต์
 */

export interface PostData {
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
}

export interface CreatePostData {
  userId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "link";
}

export interface CommentData {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
  } | null;
}

export interface CreateCommentData {
  userId: number;
  text: string;
}

export interface LikeData {
  postId: number;
  userId: number;
  type: "like" | "dislike";
}

export const postService = {
  // ดึงโพสต์ทั้งหมด
  async getAllPosts(): Promise<PostData[]> {
    const response = await apiRequest("GET", "/api/posts");
    return response.json();
  },

  // สร้างโพสต์ใหม่
  async createPost(postData: CreatePostData): Promise<PostData> {
    const response = await apiRequest("POST", "/api/posts", postData);
    return response.json();
  },

  // ดึงคอมเมนต์ของโพสต์
  async getPostComments(postId: number): Promise<CommentData[]> {
    const response = await apiRequest("GET", `/api/posts/${postId}/comments`);
    return response.json();
  },

  // เพิ่มคอมเมนต์
  async createComment(postId: number, commentData: CreateCommentData): Promise<CommentData> {
    const response = await apiRequest("POST", `/api/posts/${postId}/comments`, commentData);
    return response.json();
  },

  // ไลค์/ดิสไลค์โพสต์
  async toggleLike(postId: number, userId: number, type: "like" | "dislike"): Promise<any> {
    const response = await apiRequest("POST", `/api/posts/${postId}/like`, {
      userId,
      type
    });
    return response.json();
  },

  // ดึงสถานะไลค์ของผู้ใช้
  async getUserLike(postId: number, userId: number): Promise<any> {
    const response = await apiRequest("GET", `/api/posts/${postId}/like/${userId}`);
    return response.json();
  },
};