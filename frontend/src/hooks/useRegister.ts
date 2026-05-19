import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { RegisterPayload } from "@/types/auth.types";

export function useRegister(options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => api.register(payload),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
