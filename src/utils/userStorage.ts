
// Utility functions for user-specific localStorage management

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem('flyerflix-current-user');
};

export const getUserStorageKey = (key: string): string => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('No user logged in');
  }
  return `${key}-${userId}`;
};

export const setUserData = (key: string, data: any): void => {
  const userKey = getUserStorageKey(key);
  localStorage.setItem(userKey, JSON.stringify(data));
};

export const getUserData = (key: string): any => {
  try {
    const userKey = getUserStorageKey(key);
    const data = localStorage.getItem(userKey);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const removeUserData = (key: string): void => {
  try {
    const userKey = getUserStorageKey(key);
    localStorage.removeItem(userKey);
  } catch {
    // Ignore errors
  }
};

export const hasUserData = (key: string): boolean => {
  try {
    const userKey = getUserStorageKey(key);
    return localStorage.getItem(userKey) !== null;
  } catch {
    return false;
  }
};
