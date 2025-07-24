import { z } from "zod";

// Firebase Firestore schema definitions
// These interfaces represent the data structure in Firestore collections

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "student";
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt: Date;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdBy: string; // user ID
  createdAt: Date;
}

export interface Question {
  id: string;
  examId: string;
  questionText: string;
  questionType: "mcq" | "true_false" | "fill_blank";
  options?: string[]; // array of options for MCQ
  correctAnswer: string;
  points: number;
  orderIndex: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  studentName?: string;
  studentEmail?: string;
  startedAt: Date;
  submittedAt?: Date;
  timeRemaining?: number; // in seconds
  isSubmitted: boolean;
  score?: number;
  totalQuestions?: number;
}

export interface Answer {
  id: string;
  attemptId: string;
  questionId: string;
  userAnswer?: string;
  isCorrect?: boolean;
  isMarkedForReview: boolean;
}

export interface Video {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number; // in bytes
  duration?: number; // in seconds
  path: string;
  uploadedAt: Date;
}

export interface File {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number; // in bytes
  path: string;
  uploadedAt: Date;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["admin", "student"]).default("student"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export const insertExamSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  isActive: z.boolean().default(false),
  createdBy: z.string().min(1),
});

export const insertQuestionSchema = z.object({
  examId: z.string().min(1),
  questionText: z.string().min(1),
  questionType: z.enum(["mcq", "true_false", "fill_blank"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  points: z.number().default(1),
  orderIndex: z.number(),
});

export const insertExamAttemptSchema = z.object({
  examId: z.string().min(1),
  userId: z.string().min(1),
  studentName: z.string().optional(),
  studentEmail: z.string().email().optional(),
  timeRemaining: z.number().optional(),
  isSubmitted: z.boolean().default(false),
  score: z.number().optional(),
  totalQuestions: z.number().optional(),
});

export const insertAnswerSchema = z.object({
  attemptId: z.string().min(1),
  questionId: z.string().min(1),
  userAnswer: z.string().optional(),
  isCorrect: z.boolean().optional(),
  isMarkedForReview: z.boolean().default(false),
});

export const insertVideoSchema = z.object({
  fileName: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(1),
  duration: z.number().optional(),
  path: z.string().min(1),
});

export const insertFileSchema = z.object({
  fileName: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(1),
  path: z.string().min(1),
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type LoginData = z.infer<typeof loginSchema>;