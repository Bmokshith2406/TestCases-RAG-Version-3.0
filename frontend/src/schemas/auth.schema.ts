// auth.schema.ts

import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(32, "Username cannot exceed 32 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens"
  );

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(
    /[A-Z]/,
    "Password must contain at least one uppercase letter"
  )
  .regex(
    /[a-z]/,
    "Password must contain at least one lowercase letter"
  )
  .regex(
    /[0-9]/,
    "Password must contain at least one number"
  );

export const roleSchema = z.enum([
  "viewer",
  "editor",
  "admin",
]);

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(64, "Username cannot exceed 64 characters"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  role: roleSchema,
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type LoginSchemaType = z.infer<
  typeof loginSchema
>;

export type RegisterSchemaType = z.infer<
  typeof registerSchema
>;

export type ForgotPasswordSchemaType = z.infer<
  typeof forgotPasswordSchema
>;

export type ResetPasswordSchemaType = z.infer<
  typeof resetPasswordSchema
>;

export type RoleSchemaType = z.infer<
  typeof roleSchema
>;
