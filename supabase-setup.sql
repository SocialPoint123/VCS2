-- ลบตารางเก่าก่อน (ถ้ามี)
DROP TABLE IF EXISTS user_active_items CASCADE;
DROP TABLE IF EXISTS user_items CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;
DROP TABLE IF EXISTS loan_requests CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS credit_wallets CASCADE;
DROP TABLE IF EXISTS login_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- สร้างตารางใหม่
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE login_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  ip TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  fingerprint TEXT,
  status TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE credit_wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  note TEXT,
  balance_after DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  room_id TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE loan_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) DEFAULT 5.00,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMP,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE shop_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  media_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  item_id INTEGER NOT NULL REFERENCES shop_items(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_active_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  item_id INTEGER NOT NULL REFERENCES shop_items(id),
  type TEXT NOT NULL,
  activated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'cat',
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  happiness INTEGER DEFAULT 100,
  hunger INTEGER DEFAULT 100,
  energy INTEGER DEFAULT 100,
  last_fed TIMESTAMP DEFAULT NOW(),
  last_played TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- เพิ่มข้อมูลพื้นฐาน
INSERT INTO users (username, email, password, name, role, status) 
VALUES ('admin', 'admin@bergdotbet.com', '$2b$10$BvhV3Vtgyob83cYe7R5oj.S44aiaNEEf9nXFLURXaBw1YlOnPg2Iu', 'Admin User', 'admin', 'active');

-- สร้างกระเป๋าเงินสำหรับแอดมิน
INSERT INTO credit_wallets (user_id, balance) 
VALUES (1, 10000.00);

-- เพิ่มสินค้าตัวอย่าง
INSERT INTO shop_items (name, description, price, type, rarity, is_available) VALUES
('ธีมสีน้ำเงิน', 'เปลี่ยนสีธีมเป็นสีน้ำเงิน', 100.00, 'theme', 'common', true),
('ไอคอนดาว', 'ไอคอนดาวสำหรับโปรไฟล์', 50.00, 'icon', 'common', true),
('แบดจ์ VIP', 'แบดจ์แสดงสถานะ VIP', 500.00, 'badge', 'rare', true),
('เฟรมทอง', 'เฟรมสีทองสำหรับโปรไฟล์', 1000.00, 'frame', 'epic', true),
('ธีมพิเศษ', 'ธีมสีรุ้งพิเศษ', 2000.00, 'theme', 'legendary', true);

-- สร้าง Index สำหรับประสิทธิภาพ
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_credit_wallets_user_id ON credit_wallets(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_messages_from_user_id ON messages(from_user_id);
CREATE INDEX idx_loan_requests_user_id ON loan_requests(user_id);
CREATE INDEX idx_user_items_user_id ON user_items(user_id);
CREATE INDEX idx_pets_user_id ON pets(user_id);