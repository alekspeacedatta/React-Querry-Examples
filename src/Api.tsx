// src/api.ts

export const authApi = {
    login: async ({ username, password }: { username: string; password: string }) => {
      // Fake delay and response
      await new Promise((res) => setTimeout(res, 500));
      if (username === 'admin' && password === '1234') {
        return {
          token: 'mock-token',
          user: { id: 1, name: 'Admin User', role: 'admin' }
        };
      }
      throw new Error('Invalid credentials');
    },
  
    getCurrentUser: async (token: string) => {
      // Fake auth check
      await new Promise((res) => setTimeout(res, 300));
      if (token === 'mock-token') {
        return { id: 1, name: 'Admin User', role: 'admin' };
      }
      throw new Error('Invalid token');
    }
  };