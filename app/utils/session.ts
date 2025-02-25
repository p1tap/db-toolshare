// Simple client-side session management
// This is NOT secure for production use, but works for demo purposes

export const setCurrentUser = (userId: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUserId', userId.toString());
  }
};

export const getCurrentUserId = (): number | null => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('currentUserId');
    return userId ? parseInt(userId) : null;
  }
  return null;
};

export const clearCurrentUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUserId');
  }
};

export const isLoggedIn = (): boolean => {
  return getCurrentUserId() !== null;
}; 