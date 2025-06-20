import { useAuthStore } from '../core/store/authStore.js';

export const useAuth = () => {
  const { isAuthenticated, login, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    login,
    logout,
  };
};
