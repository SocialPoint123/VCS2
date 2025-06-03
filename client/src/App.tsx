import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationBar from "@/components/NavigationBar";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin";
import FeedPage from "@/pages/feed";
import ViewPostPage from "@/pages/post/[id]";
import PublicChatPage from "@/pages/chat";
import PrivateChatPage from "@/pages/chat/[userId]";
import LoanPage from "@/pages/loan";
import ProfilePage from "@/pages/profile";
import WalletPage from "@/pages/wallet";
import ShopPage from "@/pages/shop";

function Router() {
  return (
    <>
      <NavigationBar />
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/feed" component={FeedPage} />
        <Route path="/post/:id" component={ViewPostPage} />
        <Route path="/chat" component={PublicChatPage} />
        <Route path="/chat/:userId" component={PrivateChatPage} />
        <Route path="/loan" component={LoanPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/profile/:userId" component={ProfilePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/" component={FeedPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
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
