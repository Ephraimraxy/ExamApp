import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import { loginSchema, insertUserSchema, insertExamSchema, insertQuestionSchema } from "@shared/firebase-schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'exam-system-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user in session
      (req as any).session.userId = user.id;
      (req as any).session.role = user.role;
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.status(201).json({ 
        id: user.id, 
        username: user.username, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    const session = (req as any).session;
    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getUser(session.userId).then(user => {
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }).catch(() => {
      res.status(500).json({ message: "Internal server error" });
    });
  });

  // Authentication middleware removed for simplified system

  // Public exam routes (no authentication required)
  app.get("/api/exams", async (req: any, res) => {
    try {
      const exams = await storage.getAllExams();
      res.json(exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).json({ message: "Failed to fetch exams" });
    }
  });

  app.get("/api/exams/available", async (req: any, res) => {
    try {
      // Show all active exams (simplified filtering)
      const allExams = await storage.getAllExams();
      const availableExams = allExams.filter(exam => exam.isActive);
      console.log("Available exams:", availableExams.length, "out of", allExams.length, "total exams");
      res.json(availableExams);
    } catch (error) {
      console.error("Error fetching available exams:", error);
      res.status(500).json({ message: "Failed to fetch exams" });
    }
  });

  app.post("/api/exams", async (req: any, res) => {
    try {
      const examData = insertExamSchema.parse({
        ...req.body,
        createdBy: "default-admin", // Default creator ID for simplified system
      });
      
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      console.error("Error creating exam:", error);
      res.status(400).json({ message: "Invalid exam data" });
    }
  });

  app.get("/api/exams/:id", async (req: any, res) => {
    try {
      const examId = req.params.id;
      const exam = await storage.getExamById(examId);
      
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      // Allow access to all exams

      res.json(exam);
    } catch (error) {
      console.error("Error fetching exam:", error);
      res.status(500).json({ message: "Failed to fetch exam" });
    }
  });

  app.put("/api/exams/:id", async (req: any, res) => {
    try {
      const examId = req.params.id;
      const examData = req.body;
      
      const exam = await storage.updateExam(examId, examData);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json(exam);
    } catch (error) {
      console.error("Error updating exam:", error);
      res.status(400).json({ message: "Invalid exam data" });
    }
  });

  app.delete("/api/exams/:id", async (req: any, res) => {
    try {
      const examId = req.params.id;
      const success = await storage.deleteExam(examId);
      
      if (!success) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      console.error("Error deleting exam:", error);
      res.status(500).json({ message: "Failed to delete exam" });
    }
  });

  // Question routes
  app.get("/api/exams/:examId/questions", async (req: any, res) => {
    try {
      const examId = req.params.examId;
      const questions = await storage.getQuestionsByExamId(examId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/exams/:examId/questions", async (req: any, res) => {
    try {
      const examId = req.params.examId;
      const questionData = insertQuestionSchema.parse({
        ...req.body,
        examId,
      });
      
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  // Exam attempt routes
  app.post("/api/exams/:examId/start", async (req: any, res) => {
    try {
      const examId = req.params.examId;
      
      // Check if exam exists and is active
      const exam = await storage.getExamById(examId);
      if (!exam || !exam.isActive) {
        return res.status(400).json({ message: "Exam not available" });
      }

      // Check if exam is within time range
      const now = new Date();
      const startTime = new Date(exam.startTime);
      const endTime = new Date(exam.endTime);
      
      if (now < startTime) {
        return res.status(400).json({ message: "Exam has not started yet" });
      }
      
      if (now > endTime) {
        return res.status(400).json({ message: "Exam has ended" });
      }

      // For simplified system, allow multiple attempts

      // Get questions count
      const questions = await storage.getQuestionsByExamId(examId);
      
      // Calculate remaining time based on exam end time
      const remainingMinutes = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60)));
      const timeRemaining = Math.min(exam.duration * 60, remainingMinutes * 60); // in seconds
      
      const { studentName = "Anonymous Student", studentEmail = "student@example.com" } = req.body;
      
      const attempt = await storage.createExamAttempt({
        examId,
        userId: "default-user", // Default user for simplified system
        studentName,
        studentEmail,
        timeRemaining,
        isSubmitted: false,
        totalQuestions: questions.length,
      });

      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error starting exam:", error);
      res.status(500).json({ message: "Failed to start exam" });
    }
  });

  app.get("/api/attempts/:attemptId", async (req: any, res) => {
    try {
      const attemptId = req.params.attemptId;
      const attempt = await storage.getExamAttemptById(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      res.json(attempt);
    } catch (error) {
      console.error("Error fetching attempt:", error);
      res.status(500).json({ message: "Failed to fetch attempt" });
    }
  });

  app.put("/api/attempts/:attemptId", async (req: any, res) => {
    try {
      const attemptId = req.params.attemptId;
      const updateData = req.body;
      
      const existingAttempt = await storage.getExamAttemptById(attemptId);
      if (!existingAttempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      const attempt = await storage.updateExamAttempt(attemptId, updateData);
      res.json(attempt);
    } catch (error) {
      console.error("Error updating attempt:", error);
      res.status(400).json({ message: "Failed to update attempt" });
    }
  });

  app.post("/api/attempts/:attemptId/submit", async (req: any, res) => {
    try {
      const attemptId = req.params.attemptId;
      
      const attempt = await storage.getExamAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      if (attempt.isSubmitted) {
        return res.status(400).json({ message: "Exam already submitted" });
      }

      // Get all answers and questions to calculate score
      const answers = await storage.getAnswersByAttemptId(attemptId);
      const questions = await storage.getQuestionsByExamId(attempt.examId);
      
      // Calculate score by checking answers against correct answers
      let score = 0;
      for (const answer of answers) {
        const question = questions.find(q => q.id === answer.questionId);
        if (question && answer.userAnswer === question.correctAnswer) {
          score++;
          // Update answer as correct
          await storage.updateAnswer(answer.id, { isCorrect: true });
        } else {
          // Update answer as incorrect
          await storage.updateAnswer(answer.id, { isCorrect: false });
        }
      }

      const updatedAttempt = await storage.updateExamAttempt(attemptId, {
        isSubmitted: true,
        score,
      });

      res.json(updatedAttempt);
    } catch (error) {
      console.error("Error submitting exam:", error);
      res.status(500).json({ message: "Failed to submit exam" });
    }
  });

  // Answer routes
  app.get("/api/attempts/:attemptId/answers", async (req: any, res) => {
    try {
      const attemptId = req.params.attemptId;
      
      // Verify access to attempt
      const attempt = await storage.getExamAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      const answers = await storage.getAnswersByAttemptId(attemptId);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching answers:", error);
      res.status(500).json({ message: "Failed to fetch answers" });
    }
  });

  app.post("/api/attempts/:attemptId/answers", async (req: any, res) => {
    try {
      const attemptId = req.params.attemptId;
      const { questionId, userAnswer, isMarkedForReview } = req.body;
      
      // Verify access to attempt
      const attempt = await storage.getExamAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      if (attempt.isSubmitted) {
        return res.status(400).json({ message: "Cannot modify answers after submission" });
      }
      
      // Check if answer already exists
      const existingAnswer = await storage.getAnswerByAttemptAndQuestion(attemptId, questionId);
      
      if (existingAnswer) {
        // Update existing answer
        const updatedAnswer = await storage.updateAnswer(existingAnswer.id, {
          userAnswer,
          isMarkedForReview: isMarkedForReview || false,
        });
        res.json(updatedAnswer);
      } else {
        // Create new answer
        const answer = await storage.createAnswer({
          attemptId,
          questionId,
          userAnswer,
          isMarkedForReview: isMarkedForReview || false,
        });
        res.status(201).json(answer);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      res.status(400).json({ message: "Failed to save answer" });
    }
  });

  // All attempts route (for simplified system)
  app.get("/api/attempts", async (req: any, res) => {
    try {
      const attempts = await storage.getExamAttemptsByUser("default-user"); // Default user
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching user attempts:", error);
      res.status(500).json({ message: "Failed to fetch attempts" });
    }
  });

  // Results routes
  app.get("/api/attempts/:attemptId/results", async (req: any, res) => {
    try {
      const attemptId = req.params.attemptId;
      const attempt = await storage.getExamAttemptById(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      // Allow access to all results in simplified system

      if (!attempt.isSubmitted) {
        return res.status(400).json({ message: "Exam not submitted yet" });
      }

      const answers = await storage.getAnswersByAttemptId(attemptId);
      const questions = await storage.getQuestionsByExamId(attempt.examId);
      
      const results = questions.map(question => {
        const answer = answers.find(a => a.questionId === question.id);
        return {
          question,
          userAnswer: answer?.userAnswer || null,
          isCorrect: answer?.isCorrect || false,
          correctAnswer: question.correctAnswer,
        };
      });

      res.json({
        attempt,
        results,
        score: attempt.score || 0,
        totalQuestions: attempt.totalQuestions || 0,
        percentage: attempt.totalQuestions ? Math.round(((attempt.score || 0) / attempt.totalQuestions) * 100) : 0,
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  app.get("/api/exams/:examId/results", async (req: any, res) => {
    try {
      const examId = req.params.examId;
      const attempts = await storage.getExamAttemptsByExam(examId);
      
      const results = await Promise.all(
        attempts.map(async (attempt) => {
          const user = await storage.getUser(attempt.userId);
          return {
            attempt,
            user: {
              id: user?.id,
              username: user?.username,
              firstName: user?.firstName,
              lastName: user?.lastName,
            },
          };
        })
      );

      res.json(results);
    } catch (error) {
      console.error("Error fetching exam results:", error);
      res.status(500).json({ message: "Failed to fetch exam results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
