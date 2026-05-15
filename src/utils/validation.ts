import { z } from 'zod';

// ──── Auth Schemas ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  student_id: z
    .string()
    .min(3, 'Student ID must be at least 3 characters')
    .max(20, 'Student ID too long'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(100, 'Password too long'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  student_id: z
    .string()
    .min(3, 'Student ID must be at least 3 characters')
    .max(20, 'Student ID too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(100, 'Password too long'),
  grade: z.string().min(1, 'Please select a grade'),
  age: z
    .number()
    .int()
    .min(3, 'Age must be at least 3')
    .max(18, 'Age must be 18 or less')
    .optional(),
});

// ──── Profile Schemas ─────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
});

// ──── Quiz / Game Schemas ─────────────────────────────────────────────────────

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().min(1, 'Please select an answer'),
  timeSpent: z.number().min(0).max(3600).optional(),
});

export const gameScoreSchema = z.object({
  gameName: z.string().min(1),
  score: z.number().min(0).max(1000000),
  correctAnswers: z.number().int().min(0).optional(),
  totalQuestions: z.number().int().min(0).optional(),
  timeTaken: z.number().min(0).optional(),
});

// ──── Message Schemas ─────────────────────────────────────────────────────────

export const messageSchema = z.object({
  to: z.string().min(1, 'Recipient is required'),
  subject: z.string().min(1, 'Subject is required').max(100),
  body: z.string().min(1, 'Message cannot be empty').max(2000),
});

// ──── Type Exports ────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>;
export type GameScoreInput = z.infer<typeof gameScoreSchema>;
export type MessageInput = z.infer<typeof messageSchema>;

// ──── Utility Helper ──────────────────────────────────────────────────────────

/**
 * Safely validate data against a Zod schema.
 * Returns { success: true, data } or { success: false, errors }.
 */
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true as const, data: result.data };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.');
    if (key) errors[key] = issue.message;
  }
  return { success: false as const, errors };
}
