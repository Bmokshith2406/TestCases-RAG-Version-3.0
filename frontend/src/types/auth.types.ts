// auth.types.ts

export type AuthMode = "login" | "register";

export type UserRole = "viewer" | "editor" | "admin";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<void>;

  logout: () => void;

  register?: (payload: RegisterPayload) => Promise<void>;
}

export interface LoginFormState {
  username: string;
  password: string;
}

export interface RegisterFormState {
  username: string;
  password: string;
  role: UserRole;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  statusCode?: number;
}

export interface MutationState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
}

export interface AuthCardProps {
  children: React.ReactNode;
}

export interface AuthFieldErrors {
  username?: string;
  password?: string;
  role?: string;
}

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface AuthTabsProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

export interface LoginFormProps {
  username: string;
  password: string;

  setUsername: (value: string) => void;
  setPassword: (value: string) => void;

  onSubmit: () => void;

  loading: boolean;
}

export interface RegisterFormProps {
  username: string;
  password: string;
  role: UserRole;

  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setRole: (value: UserRole) => void;

  onSubmit: () => void;

  loading: boolean;
}
