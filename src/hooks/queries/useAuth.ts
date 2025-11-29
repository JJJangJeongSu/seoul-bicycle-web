import { useMutation } from '@tanstack/react-query';
import * as authService from '../../services/auth.service';
import { SignupData } from '../../types';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
  });
};  
