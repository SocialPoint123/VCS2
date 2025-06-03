# Deployment Instructions for BergDotBet B.B

## Step 1: Prepare Supabase Database

1. Create a new project at [Supabase](https://supabase.com/dashboard/projects)
2. Go to Settings > Database
3. Copy the connection string from "Connection string" > "Transaction pooler"
4. Replace `[YOUR-PASSWORD]` with your database password
5. Save this connection string for later use

## Step 2: Initialize Database Schema

Execute this SQL in your Supabase SQL editor to create all required tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create login_logs table
CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  ip TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  fingerprint TEXT,
  status TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create credit_wallets table
CREATE TABLE IF NOT EXISTS credit_wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
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

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  room_id TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create loan_requests table
CREATE TABLE IF NOT EXISTS loan_requests (
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

-- Create shop_items table
CREATE TABLE IF NOT EXISTS shop_items (
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

-- Create user_items table
CREATE TABLE IF NOT EXISTS user_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  item_id INTEGER NOT NULL REFERENCES shop_items(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create user_active_items table
CREATE TABLE IF NOT EXISTS user_active_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  item_id INTEGER NOT NULL REFERENCES shop_items(id),
  type TEXT NOT NULL,
  activated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
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

-- Create admin account
INSERT INTO users (username, email, password, name, role, status) 
VALUES ('admin', 'admin@bergdotbet.com', '$2b$10$BvhV3Vtgyob83cYe7R5oj.S44aiaNEEf9nXFLURXaBw1YlOnPg2Iu', 'Admin User', 'admin', 'active')
ON CONFLICT (username) DO NOTHING;

-- Create admin wallet
INSERT INTO credit_wallets (user_id, balance) 
SELECT id, 10000.00 FROM users WHERE username = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- Create sample shop items
INSERT INTO shop_items (name, description, price, type, rarity, is_available) VALUES
('ธีมสีน้ำเงิน', 'เปลี่ยนสีธีมเป็นสีน้ำเงิน', 100.00, 'theme', 'common', true),
('ไอคอนดาว', 'ไอคอนดาวสำหรับโปรไฟล์', 50.00, 'icon', 'common', true),
('แบดจ์ VIP', 'แบดจ์แสดงสถานะ VIP', 500.00, 'badge', 'rare', true),
('เฟรมทอง', 'เฟรมสีทองสำหรับโปรไฟล์', 1000.00, 'frame', 'epic', true),
('ธีมพิเศษ', 'ธีมสีรุ้งพิเศษ', 2000.00, 'theme', 'legendary', true)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_wallets_user_id ON credit_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_user_id ON loan_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_user_id ON user_items(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
```

## Step 3: Push Code to GitHub

1. Create a new repository on GitHub
2. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BergDotBet B.B Admin Panel"
   git branch -M main
   git remote add origin https://github.com/yourusername/bergdotbet-admin.git
   git push -u origin main
   ```

## Step 4: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set Framework Preset to "Other"
5. Configure Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `SESSION_SECRET`: Generate a random 64-character string
   - `NODE_ENV`: production

6. Set Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

7. Deploy the project

## Step 5: Verify Deployment

1. Access your deployed URL
2. Log in with admin credentials:
   - Username: `admin`
   - Password: `admin123`
3. Test all features:
   - User management
   - Wallet system
   - Social posts
   - Shop functionality
   - Pet system

## Step 6: Production Configuration

1. Change default admin password after first login
2. Set up proper SSL certificates (handled by Vercel)
3. Configure domain name if needed
4. Set up monitoring and alerts
5. Review security settings

## Environment Variables Reference

Required environment variables for production:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SESSION_SECRET=your-64-character-random-string
NODE_ENV=production
```

## Default Admin Account

- Username: `admin`
- Password: `admin123`
- Role: `admin`

**Important**: Change the default password immediately after deployment.

## Support

For deployment issues or questions, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- Project README.md file