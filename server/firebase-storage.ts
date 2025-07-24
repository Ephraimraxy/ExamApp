import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  and as firestoreAnd,
  Timestamp,
} from "firebase/firestore";
import { db } from "@shared/firebase";
import {
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
} from "@shared/firebase-schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Exam operations
  createExam(exam: InsertExam): Promise<Exam>;
  getExamById(id: string): Promise<Exam | undefined>;
  getAllExams(): Promise<Exam[]>;
  getExamsByCreator(creatorId: string): Promise<Exam[]>;
  getActiveExams(): Promise<Exam[]>;
  updateExam(id: string, exam: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: string): Promise<boolean>;

  // Question operations
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsByExamId(examId: string): Promise<Question[]>;
  updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: string): Promise<boolean>;

  // Exam attempt operations
  createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt>;
  getExamAttemptById(id: string): Promise<ExamAttempt | undefined>;
  getExamAttemptByUserAndExam(userId: string, examId: string): Promise<ExamAttempt | undefined>;
  updateExamAttempt(id: string, attempt: Partial<InsertExamAttempt>): Promise<ExamAttempt | undefined>;
  getExamAttemptsByExam(examId: string): Promise<ExamAttempt[]>;
  getExamAttemptsByUser(userId: string): Promise<ExamAttempt[]>;

  // Answer operations
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  getAnswersByAttemptId(attemptId: string): Promise<Answer[]>;
  updateAnswer(id: string, answer: Partial<InsertAnswer>): Promise<Answer | undefined>;
  getAnswerByAttemptAndQuestion(attemptId: string, questionId: string): Promise<Answer | undefined>;
}

export class FirebaseStorage implements IStorage {
  // Helper function to convert Firestore timestamps to Date
  private convertTimestamps(data: any): any {
    const result = { ...data };
    for (const key in result) {
      if (result[key] instanceof Timestamp) {
        result[key] = result[key].toDate();
      }
    }
    return result;
  }

  // Helper function to convert Date objects to Firestore timestamps
  private convertDatesToTimestamps(data: any): any {
    const result = { ...data };
    for (const key in result) {
      if (result[key] instanceof Date) {
        result[key] = Timestamp.fromDate(result[key]);
      }
    }
    return result;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const userDoc = await getDoc(doc(db, "users", id));
    if (!userDoc.exists()) return undefined;
    return this.convertTimestamps({ id: userDoc.id, ...userDoc.data() }) as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return undefined;
    const userDoc = querySnapshot.docs[0];
    return this.convertTimestamps({ id: userDoc.id, ...userDoc.data() }) as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userData = {
      ...insertUser,
      createdAt: Timestamp.fromDate(new Date()),
    };
    const docRef = await addDoc(collection(db, "users"), userData);
    return this.convertTimestamps({ id: docRef.id, ...userData }) as User;
  }

  // Exam operations
  async createExam(insertExam: InsertExam): Promise<Exam> {
    const examData = {
      ...this.convertDatesToTimestamps(insertExam),
      createdAt: Timestamp.fromDate(new Date()),
    };
    const docRef = await addDoc(collection(db, "exams"), examData);
    return this.convertTimestamps({ id: docRef.id, ...examData }) as Exam;
  }

  async getExamById(id: string): Promise<Exam | undefined> {
    const examDoc = await getDoc(doc(db, "exams", id));
    if (!examDoc.exists()) return undefined;
    return this.convertTimestamps({ id: examDoc.id, ...examDoc.data() }) as Exam;
  }

  async getAllExams(): Promise<Exam[]> {
    const q = query(collection(db, "exams"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Exam
    );
  }

  async getExamsByCreator(creatorId: string): Promise<Exam[]> {
    const q = query(
      collection(db, "exams"), 
      where("createdBy", "==", creatorId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Exam
    );
  }

  async getActiveExams(): Promise<Exam[]> {
    const now = Timestamp.fromDate(new Date());
    const q = query(
      collection(db, "exams"),
      where("isActive", "==", true),
      where("startTime", "<=", now),
      where("endTime", ">=", now),
      orderBy("startTime", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Exam
    );
  }

  async updateExam(id: string, examData: Partial<InsertExam>): Promise<Exam | undefined> {
    const examRef = doc(db, "exams", id);
    const convertedData = this.convertDatesToTimestamps(examData);
    await updateDoc(examRef, convertedData);
    return await this.getExamById(id);
  }

  async deleteExam(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "exams", id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Question operations
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const docRef = await addDoc(collection(db, "questions"), insertQuestion);
    return { id: docRef.id, ...insertQuestion } as Question;
  }

  async getQuestionsByExamId(examId: string): Promise<Question[]> {
    try {
      // For now, return empty array to handle indexing issues temporarily
      console.log(`Attempting to fetch questions for exam: ${examId}`);
      
      // Get all questions without any query to avoid indexing issues
      const questionsSnapshot = await getDocs(collection(db, "questions"));
      console.log(`Total questions found: ${questionsSnapshot.docs.length}`);
      
      const allQuestions = questionsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Question data:`, data);
        return { id: doc.id, ...data } as Question;
      });
      
      // Filter by examId
      const examQuestions = allQuestions.filter(question => {
        console.log(`Checking question ${question.id} for exam ${question.examId} against ${examId}`);
        return question.examId === examId;
      });
      
      console.log(`Found ${examQuestions.length} questions for exam ${examId}`);
      
      // Sort by orderIndex
      return examQuestions.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    } catch (error) {
      console.error('Error getting questions by exam ID:', error);
      throw error;
    }
  }

  async updateQuestion(id: string, questionData: Partial<InsertQuestion>): Promise<Question | undefined> {
    const questionRef = doc(db, "questions", id);
    await updateDoc(questionRef, questionData);
    const questionDoc = await getDoc(questionRef);
    if (!questionDoc.exists()) return undefined;
    return { id: questionDoc.id, ...questionDoc.data() } as Question;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "questions", id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Exam attempt operations
  async createExamAttempt(insertAttempt: InsertExamAttempt): Promise<ExamAttempt> {
    const attemptData = {
      ...insertAttempt,
      startedAt: Timestamp.fromDate(new Date()),
    };
    const docRef = await addDoc(collection(db, "examAttempts"), attemptData);
    return this.convertTimestamps({ id: docRef.id, ...attemptData }) as ExamAttempt;
  }

  async getExamAttemptById(id: string): Promise<ExamAttempt | undefined> {
    const attemptDoc = await getDoc(doc(db, "examAttempts", id));
    if (!attemptDoc.exists()) return undefined;
    return this.convertTimestamps({ id: attemptDoc.id, ...attemptDoc.data() }) as ExamAttempt;
  }

  async getExamAttemptByUserAndExam(userId: string, examId: string): Promise<ExamAttempt | undefined> {
    const q = query(
      collection(db, "examAttempts"),
      where("userId", "==", userId),
      where("examId", "==", examId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return undefined;
    const attemptDoc = querySnapshot.docs[0];
    return this.convertTimestamps({ id: attemptDoc.id, ...attemptDoc.data() }) as ExamAttempt;
  }

  async updateExamAttempt(id: string, attemptData: Partial<InsertExamAttempt>): Promise<ExamAttempt | undefined> {
    const attemptRef = doc(db, "examAttempts", id);
    const convertedData = this.convertDatesToTimestamps(attemptData);
    await updateDoc(attemptRef, convertedData);
    return await this.getExamAttemptById(id);
  }

  async getExamAttemptsByExam(examId: string): Promise<ExamAttempt[]> {
    const q = query(
      collection(db, "examAttempts"), 
      where("examId", "==", examId),
      orderBy("startedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as ExamAttempt
    );
  }

  async getExamAttemptsByUser(userId: string): Promise<ExamAttempt[]> {
    const q = query(
      collection(db, "examAttempts"), 
      where("userId", "==", userId),
      orderBy("startedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as ExamAttempt
    );
  }

  // Answer operations
  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const docRef = await addDoc(collection(db, "answers"), insertAnswer);
    return { id: docRef.id, ...insertAnswer } as Answer;
  }

  async getAnswersByAttemptId(attemptId: string): Promise<Answer[]> {
    const q = query(collection(db, "answers"), where("attemptId", "==", attemptId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      ({ id: doc.id, ...doc.data() }) as Answer
    );
  }

  async updateAnswer(id: string, answerData: Partial<InsertAnswer>): Promise<Answer | undefined> {
    const answerRef = doc(db, "answers", id);
    await updateDoc(answerRef, answerData);
    const answerDoc = await getDoc(answerRef);
    if (!answerDoc.exists()) return undefined;
    return { id: answerDoc.id, ...answerDoc.data() } as Answer;
  }

  async getAnswerByAttemptAndQuestion(attemptId: string, questionId: string): Promise<Answer | undefined> {
    const q = query(
      collection(db, "answers"),
      where("attemptId", "==", attemptId),
      where("questionId", "==", questionId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return undefined;
    const answerDoc = querySnapshot.docs[0];
    return { id: answerDoc.id, ...answerDoc.data() } as Answer;
  }
}

export const storage = new FirebaseStorage();