// src/hooks/auth.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';

const fetchCurrentUser = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    return await authApi.getCurrentUser(token);
  } catch (error) {
    localStorage.removeItem('authToken');
    return null;
  }
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: Infinity
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      queryClient.setQueryData(['currentUser'], data.user);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      localStorage.removeItem('authToken');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
    }
  });
};
