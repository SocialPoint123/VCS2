# BergDotBet B.B - Advanced Multi-Feature Admin Panel

An advanced multi-feature admin panel for BergDotBet B.B website, providing comprehensive user and transaction management capabilities with an innovative pet-based credit system and enhanced item inventory management.

## Features

- **Authentication System**: Secure login/register with password hashing and session management
- **User Management**: Complete admin panel for managing users, roles, and permissions
- **Credit System**: Advanced wallet management with transaction tracking
- **Social Features**: Post creation, comments, likes/dislikes system
- **Pet System**: Virtual pet management with feeding, playing, and leveling
- **Shop System**: Item marketplace with rarity-based inventory
- **Chat System**: Real-time messaging (public and private)
- **Loan Management**: Credit lending system with approval workflow
- **Real-time Analytics**: Dashboard with comprehensive statistics

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Custom session-based auth with bcrypt
- **Deployment**: Vercel

## Quick Start

### 1. Database Setup (Supabase)

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string from "Connection string" > "Transaction pooler"
4. Replace `[YOUR-PASSWORD]` with your database password

### 2. Environment Variables

Create `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=your-supabase-connection-string

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret
```

### 3. Installation

```bash
# Install dependencies
npm install

# Run database migrations (tables will be created automatically)
npm run dev

# Start development server
npm run dev
```

### 4. Default Admin Account

**Username**: admin  
**Password**: admin123

## Deployment to Vercel

### 1. Prepare for Deployment

```bash
# Build the client
npm run build

# Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Supabase connection string
   - `SESSION_SECRET`: A secure random string
3. Deploy

### 3. Environment Variables for Production

In your Vercel dashboard, add these environment variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SESSION_SECRET=your-production-session-secret
NODE_ENV=production
```

## Database Schema

The system automatically creates the following tables:

- `users` - User accounts and authentication
- `credit_wallets` - User wallet balances
- `credit_transactions` - Transaction history
- `posts` - Social media posts
- `comments` - Post comments
- `post_likes` - Like/dislike system
- `messages` - Chat messages
- `loan_requests` - Credit loan system
- `shop_items` - Marketplace items
- `user_items` - User inventory
- `pets` - Virtual pet system
- `login_logs` - Security audit logs

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/dashboard-stats` - System statistics (admin)
- `GET /api/profile/:userId` - User profile

### Social Features
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/dislike post
- `GET /api/posts/:id/comments` - Get post comments

### Wallet & Transactions
- `GET /api/wallet/:userId` - Get user wallet
- `POST /api/wallet/top-up` - Request credit top-up
- `GET /api/transactions/:userId` - Transaction history

### Shop & Inventory
- `GET /api/shop/items` - Get shop items
- `POST /api/shop/purchase` - Purchase item
- `GET /api/inventory/:userId` - User inventory

### Pet System
- `GET /api/pet/:userId` - Get user pet
- `POST /api/pet/create` - Create new pet
- `POST /api/pet/:userId/action` - Pet interaction

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure session-based authentication
- **XSS Protection**: Input sanitization and output encoding
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **Authentication Middleware**: Protected routes with proper authorization

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:generate  # Generate migrations
npm run db:push      # Push schema changes
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - BergDotBet B.B Internal Use Only

## Support

For support and questions, contact the development team.