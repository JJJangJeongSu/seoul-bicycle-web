import { useMutation } from '@tanstack/react-query';
import { useApiMode } from '../../contexts/ApiModeContext';
import { AuthService } from '../../services/auth.service';

export const useLogin = () => {
  const { useMockMode } = useApiMode();
  const authService = new AuthService(useMockMode);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
  });
};
