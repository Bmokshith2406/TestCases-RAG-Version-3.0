import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth";
import type { LoginPayload } from "@/types/auth.types";

export function useLogin(options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await login(payload.username, payload.password);
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
