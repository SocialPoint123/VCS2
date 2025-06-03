import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin";
import FeedPage from "@/pages/feed";
import ViewPostPage from "@/pages/post/[id]";
import PublicChatPage from "@/pages/chat";
import PrivateChatPage from "@/pages/chat/[userId]";

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/feed" component={FeedPage} />
      <Route path="/post/:id" component={ViewPostPage} />
      <Route path="/chat" component={PublicChatPage} />
      <Route path="/chat/:userId" component={PrivateChatPage} />
      <Route path="/" component={FeedPage} />
      <Route component={NotFound} />
    </Switch>
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
