import {
  users,
  exams,
  questions,
  examAttempts,
  answers,
  type User,
  type InsertUser,
  type Exam,
  type InsertExam,
  type Question,
  type InsertQuestion,
  type ExamAttempt,
  type InsertExamAttempt,
  type Answer,
  type InsertAnswer,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Exam operations
  createExam(exam: InsertExam): Promise<Exam>;
  getExamById(id: number): Promise<Exam | undefined>;
  getExamsByCreator(creatorId: number): Promise<Exam[]>;
  getActiveExams(): Promise<Exam[]>;
  updateExam(id: number, exam: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: number): Promise<boolean>;

  // Question operations
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsByExamId(examId: number): Promise<Question[]>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;

  // Exam attempt operations
  createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt>;
  getExamAttemptById(id: number): Promise<ExamAttempt | undefined>;
  getExamAttemptByUserAndExam(userId: number, examId: number): Promise<ExamAttempt | undefined>;
  updateExamAttempt(id: number, attempt: Partial<InsertExamAttempt>): Promise<ExamAttempt | undefined>;
  getExamAttemptsByExam(examId: number): Promise<ExamAttempt[]>;
  getExamAttemptsByUser(userId: number): Promise<ExamAttempt[]>;

  // Answer operations
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  getAnswersByAttemptId(attemptId: number): Promise<Answer[]>;
  updateAnswer(id: number, answer: Partial<InsertAnswer>): Promise<Answer | undefined>;
  getAnswerByAttemptAndQuestion(attemptId: number, questionId: number): Promise<Answer | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Exam operations
  async createExam(insertExam: InsertExam): Promise<Exam> {
    const [exam] = await db.insert(exams).values(insertExam).returning();
    return exam;
  }

  async getExamById(id: number): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam || undefined;
  }

  async getExamsByCreator(creatorId: number): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.createdBy, creatorId)).orderBy(desc(exams.createdAt));
  }

  async getActiveExams(): Promise<Exam[]> {
    const now = new Date();
    return await db.select().from(exams).where(
      and(
        eq(exams.isActive, true),
        eq(exams.startTime, now) // TODO: Implement proper time range check
      )
    ).orderBy(asc(exams.startTime));
  }

  async updateExam(id: number, examData: Partial<InsertExam>): Promise<Exam | undefined> {
    const [exam] = await db.update(exams).set(examData).where(eq(exams.id, id)).returning();
    return exam || undefined;
  }

  async deleteExam(id: number): Promise<boolean> {
    const result = await db.delete(exams).where(eq(exams.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Question operations
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }

  async getQuestionsByExamId(examId: number): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.examId, examId)).orderBy(asc(questions.orderIndex));
  }

  async updateQuestion(id: number, questionData: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [question] = await db.update(questions).set(questionData).where(eq(questions.id, id)).returning();
    return question || undefined;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Exam attempt operations
  async createExamAttempt(insertAttempt: InsertExamAttempt): Promise<ExamAttempt> {
    const [attempt] = await db.insert(examAttempts).values(insertAttempt).returning();
    return attempt;
  }

  async getExamAttemptById(id: number): Promise<ExamAttempt | undefined> {
    const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, id));
    return attempt || undefined;
  }

  async getExamAttemptByUserAndExam(userId: number, examId: number): Promise<ExamAttempt | undefined> {
    const [attempt] = await db.select().from(examAttempts).where(
      and(eq(examAttempts.userId, userId), eq(examAttempts.examId, examId))
    );
    return attempt || undefined;
  }

  async updateExamAttempt(id: number, attemptData: Partial<InsertExamAttempt>): Promise<ExamAttempt | undefined> {
    const [attempt] = await db.update(examAttempts).set(attemptData).where(eq(examAttempts.id, id)).returning();
    return attempt || undefined;
  }

  async getExamAttemptsByExam(examId: number): Promise<ExamAttempt[]> {
    return await db.select().from(examAttempts).where(eq(examAttempts.examId, examId)).orderBy(desc(examAttempts.startedAt));
  }

  async getExamAttemptsByUser(userId: number): Promise<ExamAttempt[]> {
    return await db.select().from(examAttempts).where(eq(examAttempts.userId, userId)).orderBy(desc(examAttempts.startedAt));
  }

  // Answer operations
  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const [answer] = await db.insert(answers).values(insertAnswer).returning();
    return answer;
  }

  async getAnswersByAttemptId(attemptId: number): Promise<Answer[]> {
    return await db.select().from(answers).where(eq(answers.attemptId, attemptId));
  }

  async updateAnswer(id: number, answerData: Partial<InsertAnswer>): Promise<Answer | undefined> {
    const [answer] = await db.update(answers).set(answerData).where(eq(answers.id, id)).returning();
    return answer || undefined;
  }

  async getAnswerByAttemptAndQuestion(attemptId: number, questionId: number): Promise<Answer | undefined> {
    const [answer] = await db.select().from(answers).where(
      and(eq(answers.attemptId, attemptId), eq(answers.questionId, questionId))
    );
    return answer || undefined;
  }
}

export const storage = new DatabaseStorage();
