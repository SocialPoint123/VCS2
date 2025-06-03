import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

/**
 * ลงทะเบียน API routes สำหรับระบบแอดมิน
 * ครอบคลุมการจัดการผู้ใช้ สถิติ ประวัติล็อกอิน และธุรกรรมเครดิต
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // API สำหรับดึงสถิติภาพรวมระบบ
  app.get("/api/admin/dashboard-stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // API สำหรับดึงรายชื่อผู้ใช้ทั้งหมดพร้อมยอดเครดิต
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // รวมข้อมูลผู้ใช้กับยอดเครดิตจากกระเป๋าเงิน
      const usersWithWallets = await Promise.all(
        users.map(async (user) => {
          const wallet = await storage.getUserWallet(user.id);
          return {
            ...user,
            creditBalance: wallet?.balance || "0.00"
          };
        })
      );
      res.json(usersWithWallets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // API สำหรับดึงประวัติการล็อกอินของผู้ใช้
  app.get("/api/admin/users/:userId/login-logs", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const logs = await storage.getUserLoginLogs(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch login logs" });
    }
  });

  // API สำหรับดึงประวัติธุรกรรมเครดิตของผู้ใช้
  app.get("/api/admin/users/:userId/credit-transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const transactions = await storage.getUserCreditTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credit transactions" });
    }
  });

  // API สำหรับอัปเดตสถานะผู้ใช้ (ใช้งาน/ระงับ/แบน)
  app.patch("/api/admin/users/:userId/status", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { status } = req.body;

      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // ตรวจสอบว่าสถานะที่ส่งมาถูกต้อง
      if (!status || !["active", "suspended", "banned"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updatedUser = await storage.updateUserStatus(userId, status);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // API สำหรับตรวจสอบสิทธิ์แอดมิน
  app.get("/api/admin/auth", async (req, res) => {
    try {
      // ในการใช้งานจริงควรตรวจสอบ session หรือ JWT token
      res.json({ isAdmin: true, user: { id: 1, name: "Admin User", email: "admin@bergdotbet.com" } });
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  // === API สำหรับระบบ Feed โซเชียลมีเดีย ===

  // API สำหรับดึงโพสต์ทั้งหมดพร้อมข้อมูลผู้ใช้และสถิติ
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          const user = await storage.getUser(post.userId);
          const likes = await storage.getPostLikes(post.id);
          const comments = await storage.getPostComments(post.id);
          
          const likesCount = likes.filter(like => like.type === 'like').length;
          const dislikesCount = likes.filter(like => like.type === 'dislike').length;
          
          return {
            ...post,
            user: user ? { id: user.id, name: user.name, username: user.username } : null,
            likesCount,
            dislikesCount,
            commentsCount: comments.length
          };
        })
      );
      res.json(postsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // API สำหรับสร้างโพสต์ใหม่
  app.post("/api/posts", async (req, res) => {
    try {
      const { userId, content, mediaUrl, mediaType } = req.body;
      
      if (!userId || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newPost = await storage.createPost({
        userId,
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null
      });

      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // API สำหรับดึงคอมเมนต์ของโพสต์พร้อมข้อมูลผู้ใช้
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }

      const comments = await storage.getPostComments(postId);
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.userId);
          return {
            ...comment,
            user: user ? { id: user.id, name: user.name, username: user.username } : null
          };
        })
      );

      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // API สำหรับเพิ่มคอมเมนต์
  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { userId, text } = req.body;

      if (isNaN(postId) || !userId || !text) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newComment = await storage.createComment({
        postId,
        userId,
        text
      });

      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // API สำหรับไลค์/ดิสไลค์โพสต์
  app.post("/api/posts/:postId/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { userId, type } = req.body;

      if (isNaN(postId) || !userId || !['like', 'dislike'].includes(type)) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      const result = await storage.togglePostLike({
        postId,
        userId,
        type
      });

      res.json({ success: true, like: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle like" });
    }
  });

  // API สำหรับดึงสถานะไลค์ของผู้ใช้สำหรับโพสต์
  app.get("/api/posts/:postId/like/:userId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = parseInt(req.params.userId);

      if (isNaN(postId) || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      const userLike = await storage.getUserPostLike(postId, userId);
      res.json({ like: userLike });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user like" });
    }
  });

  const httpServer = createServer(app);
  // API สำหรับระบบแชท
  
  // ส่งข้อความใหม่
  app.post("/api/messages", async (req, res) => {
    try {
      const { fromUserId, toUserId, roomId, message, messageType } = req.body;
      
      if (!fromUserId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newMessage = await storage.createMessage({
        fromUserId,
        toUserId: toUserId || null,
        roomId: roomId || null,
        message,
        messageType: messageType || "text",
      });

      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // ดึงข้อความแชทส่วนตัว
  app.get("/api/messages/private/:userId1/:userId2", async (req, res) => {
    try {
      const userId1 = parseInt(req.params.userId1);
      const userId2 = parseInt(req.params.userId2);
      
      if (isNaN(userId1) || isNaN(userId2)) {
        return res.status(400).json({ error: "Invalid user IDs" });
      }

      const messages = await storage.getPrivateMessages(userId1, userId2);
      
      // เพิ่มข้อมูลผู้ใช้สำหรับแต่ละข้อความ
      const messagesWithUsers = await Promise.all(
        messages.map(async (msg) => {
          const fromUser = await storage.getUser(msg.fromUserId);
          const toUser = msg.toUserId ? await storage.getUser(msg.toUserId) : null;
          return {
            ...msg,
            fromUser: fromUser ? { id: fromUser.id, name: fromUser.name, username: fromUser.username } : null,
            toUser: toUser ? { id: toUser.id, name: toUser.name, username: toUser.username } : null,
          };
        })
      );

      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch private messages" });
    }
  });

  // ดึงข้อความโถงแชทสาธารณะ
  app.get("/api/messages/public/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const messages = await storage.getPublicMessages(roomId);
      
      // เพิ่มข้อมูลผู้ใช้สำหรับแต่ละข้อความ
      const messagesWithUsers = await Promise.all(
        messages.map(async (msg) => {
          const fromUser = await storage.getUser(msg.fromUserId);
          return {
            ...msg,
            fromUser: fromUser ? { id: fromUser.id, name: fromUser.name, username: fromUser.username } : null,
          };
        })
      );

      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch public messages" });
    }
  });

  // ทำเครื่องหมายข้อความว่าอ่านแล้ว
  app.patch("/api/messages/:messageId/read", async (req, res) => {
    try {
      const messageId = parseInt(req.params.messageId);
      if (isNaN(messageId)) {
        return res.status(400).json({ error: "Invalid message ID" });
      }

      const success = await storage.markMessageAsRead(messageId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to mark message as read" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // นับข้อความที่ยังไม่ได้อ่าน
  app.get("/api/messages/unread/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const count = await storage.getUnreadMessageCount(userId);
      res.json({ unreadCount: count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get unread message count" });
    }
  });

  // API สำหรับระบบสินเชื่อ
  
  // สร้างคำขอสินเชื่อใหม่
  app.post("/api/loans", async (req, res) => {
    try {
      const { userId, amount, interestRate, totalAmount, dueDate } = req.body;
      
      if (!userId || !amount || !totalAmount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // ตรวจสอบสิทธิ์ของผู้ใช้
      const isEligible = await storage.checkUserEligibility(userId);
      if (!isEligible) {
        return res.status(403).json({ 
          error: "Not eligible for loan",
          message: "บัญชีต้องมีอายุอย่างน้อย 3 วันและไม่มีสินเชื่อค้างชำระ"
        });
      }

      const newLoan = await storage.createLoanRequest({
        userId,
        amount,
        interestRate: interestRate || "5.00",
        totalAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "pending",
        note: null,
      });

      res.json(newLoan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create loan request" });
    }
  });

  // ดึงคำขอสินเชื่อของผู้ใช้
  app.get("/api/loans/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const loans = await storage.getUserLoanRequests(userId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user loans" });
    }
  });

  // ดึงคำขอสินเชื่อทั้งหมด (สำหรับแอดมิน)
  app.get("/api/loans", async (req, res) => {
    try {
      const loans = await storage.getAllLoanRequests();
      
      // เพิ่มข้อมูลผู้ใช้สำหรับแต่ละคำขอ
      const loansWithUsers = await Promise.all(
        loans.map(async (loan) => {
          const user = await storage.getUser(loan.userId);
          return {
            ...loan,
            user: user ? { id: user.id, name: user.name, username: user.username, email: user.email } : null,
          };
        })
      );

      res.json(loansWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loans" });
    }
  });

  // อัปเดตสถานะคำขอสินเชื่อ
  app.patch("/api/loans/:loanId/status", async (req, res) => {
    try {
      const loanId = parseInt(req.params.loanId);
      const { status, note } = req.body;
      
      if (isNaN(loanId) || !status) {
        return res.status(400).json({ error: "Invalid loan ID or status" });
      }

      const updatedLoan = await storage.updateLoanRequestStatus(loanId, status, note);
      if (updatedLoan) {
        res.json(updatedLoan);
      } else {
        res.status(404).json({ error: "Loan request not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update loan status" });
    }
  });

  // ตรวจสอบสิทธิ์การขอสินเชื่อ
  app.get("/api/loans/eligibility/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const isEligible = await storage.checkUserEligibility(userId);
      res.json({ eligible: isEligible });
    } catch (error) {
      res.status(500).json({ error: "Failed to check eligibility" });
    }
  });

  return httpServer;
}
