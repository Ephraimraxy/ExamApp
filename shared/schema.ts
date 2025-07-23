import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // "admin" or "student"
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isActive: boolean("is_active").default(false),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // "mcq", "true_false", "fill_blank"
  options: jsonb("options"), // array of options for MCQ
  correctAnswer: text("correct_answer").notNull(),
  points: integer("points").default(1),
  orderIndex: integer("order_index").notNull(),
});

export const examAttempts = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id),
  userId: integer("user_id").notNull().references(() => users.id),
  studentName: text("student_name"),
  studentEmail: text("student_email"),
  startedAt: timestamp("started_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  timeRemaining: integer("time_remaining"), // in seconds
  isSubmitted: boolean("is_submitted").default(false),
  score: integer("score"),
  totalQuestions: integer("total_questions"),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull().references(() => examAttempts.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  isMarkedForReview: boolean("is_marked_for_review").default(false),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  examsCreated: many(exams),
  examAttempts: many(examAttempts),
}));

export const examsRelations = relations(exams, ({ one, many }) => ({
  creator: one(users, {
    fields: [exams.createdBy],
    references: [users.id],
  }),
  questions: many(questions),
  attempts: many(examAttempts),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  answers: many(answers),
}));

export const examAttemptsRelations = relations(examAttempts, ({ one, many }) => ({
  exam: one(exams, {
    fields: [examAttempts.examId],
    references: [exams.id],
  }),
  user: one(users, {
    fields: [examAttempts.userId],
    references: [users.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  attempt: one(examAttempts, {
    fields: [answers.attemptId],
    references: [examAttempts.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertExamAttemptSchema = createInsertSchema(examAttempts).omit({
  id: true,
  startedAt: true,
  submittedAt: true,
});

export const insertAnswerSchema = createInsertSchema(answers).omit({
  id: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type Answer = typeof answers.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
