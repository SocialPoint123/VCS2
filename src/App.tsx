import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarNavigation from "@/components/SidebarNavigation";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AdminDashboard from "@/pages/admin";
import FeedPage from "@/pages/feed";
import ViewPostPage from "@/pages/post/[id]";
import PublicChatPage from "@/pages/chat";
import PrivateChatPage from "@/pages/chat/[userId]";
import LoanPage from "@/pages/loan";
import ProfilePage from "@/pages/profile";
import WalletPage from "@/pages/wallet";
import ShopPage from "@/pages/shop";
import PetPage from "@/pages/pet";
import InventoryPage from "@/pages/inventory";
import ShopManagement from "@/pages/admin/shop-management";

function AuthenticatedApp() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNavigation />
      <main className="flex-1 ml-64 p-6">
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/shop" component={ShopManagement} />
          <Route path="/feed" component={FeedPage} />
          <Route path="/post/:id" component={ViewPostPage} />
          <Route path="/chat" component={PublicChatPage} />
          <Route path="/chat/:userId" component={PrivateChatPage} />
          <Route path="/loan" component={LoanPage} />
          <Route path="/wallet" component={WalletPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/inventory" component={InventoryPage} />
          <Route path="/pet" component={PetPage} />
          <Route path="/profile/:userId" component={ProfilePage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/" component={FeedPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function UnauthenticatedApp() {
  return (
    <Switch>
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route component={LoginPage} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
