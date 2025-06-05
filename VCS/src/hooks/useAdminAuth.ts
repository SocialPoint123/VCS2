import { useAuth } from "./useAuth";

export function useAdminAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    data: user ? {
      isAdmin: user.role === "admin",
      user: user
    } : null,
    isLoading,
    error: !isAuthenticated ? new Error("Not authenticated") : null,
  };
}
