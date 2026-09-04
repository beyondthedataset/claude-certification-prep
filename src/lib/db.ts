import { createClient, Client } from '@libsql/client';
import { User, UserProgress, ExamAttempt, TeamMemberStats, DomainKey } from './types';
import { hashPassword, comparePassword } from './auth';
import { QUESTIONS_DATA } from './questions-data';

interface StoredUser extends User {
  passwordHash: string;
}

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://claude-prep-ravishkumar.aws-ap-south-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgzMzQ3MjAsImlkIjoiMDFhMDYxMGQtNTgwMS03YTBjLTllN2QtMWZmZThiMThiNzY5Iiwia2lkIjoiV2JIM1ljeVpxZzQ2UjdxWW9UeklVWnVqamFob0ktNWw5bTE3enY3YkdWWSIsInJpZCI6Ijk1ZjJiOTdlLTBjNzQtNDA5NS1hZmQ3LWExZjNjMWRkYTFlOSJ9.0-fwhUzewZCxOWJY6yEutr4YhirnoGIpiIRZAnOC0sK9y8sBSIdluBkp62_82BjI1_0HrFjml6ZjgqRZTQe_AA';

let client: Client | null = null;
let initialized = false;

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });
  }
  return client;
}

export async function initDatabase(): Promise<void> {
  if (initialized) return;
  const db = getClient();

  try {
    // 1. Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        passwordHash TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // 2. User Progress table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_progress (
        userId TEXT PRIMARY KEY,
        answers TEXT NOT NULL DEFAULT '{}',
        starred TEXT NOT NULL DEFAULT '{}',
        notes TEXT NOT NULL DEFAULT '{}',
        updatedAt TEXT NOT NULL
      );
    `);

    // 3. Exam Attempts table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        examType TEXT NOT NULL,
        domainKey TEXT,
        questionNumbers TEXT NOT NULL,
        answers TEXT NOT NULL,
        flagged TEXT NOT NULL,
        startedAt TEXT NOT NULL,
        completedAt TEXT,
        timeSpentSeconds INTEGER NOT NULL,
        totalQuestions INTEGER NOT NULL,
        score INTEGER NOT NULL,
        scorePct INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        domainScores TEXT NOT NULL
      );
    `);

    // Check if initial users exist, if not create admin account
    const usersCount = await db.execute('SELECT COUNT(*) as count FROM users');
    const count = Number(usersCount.rows[0]?.count || 0);

    if (count === 0) {
      const defaultHash = await hashPassword('claude2026');
      const now = new Date().toISOString();

      await db.execute({
        sql: `INSERT INTO users (id, username, fullName, role, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        args: ['user_admin', 'admin', 'Lead Architect (Admin)', 'admin', defaultHash, now],
      });

      await db.execute({
        sql: `INSERT INTO user_progress (userId, answers, starred, notes, updatedAt) VALUES (?, ?, ?, ?, ?)`,
        args: ['user_admin', '{}', '{}', '{}', now],
      });
    }

    initialized = true;
  } catch (err) {
    console.error('Turso database initialization error:', err);
  }
}

export async function findUserByUsername(username: string): Promise<StoredUser | null> {
  await initDatabase();
  const db = getClient();
  const res = await db.execute({
    sql: 'SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
    args: [username.trim()],
  });

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    id: String(row.id),
    username: String(row.username),
    fullName: String(row.fullName),
    role: row.role as 'admin' | 'member',
    createdAt: String(row.createdAt),
    passwordHash: String(row.passwordHash),
  };
}

export async function findUserById(id: string): Promise<User | null> {
  await initDatabase();
  const db = getClient();
  const res = await db.execute({
    sql: 'SELECT id, username, fullName, role, createdAt FROM users WHERE id = ? LIMIT 1',
    args: [id],
  });

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    id: String(row.id),
    username: String(row.username),
    fullName: String(row.fullName),
    role: row.role as 'admin' | 'member',
    createdAt: String(row.createdAt),
  };
}

export async function registerUser(params: {
  username: string;
  password: string;
  fullName?: string;
}): Promise<User> {
  await initDatabase();
  const db = getClient();

  const existing = await findUserByUsername(params.username);
  if (existing) {
    throw new Error('Username already exists. Please choose a different username.');
  }

  const passwordHash = await hashPassword(params.password);
  const now = new Date().toISOString();
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: params.username.trim(),
    fullName: (params.fullName || params.username).trim(),
    role: 'member',
    createdAt: now,
  };

  await db.execute({
    sql: 'INSERT INTO users (id, username, fullName, role, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    args: [newUser.id, newUser.username, newUser.fullName, newUser.role, passwordHash, newUser.createdAt],
  });

  await db.execute({
    sql: 'INSERT INTO user_progress (userId, answers, starred, notes, updatedAt) VALUES (?, ?, ?, ?, ?)',
    args: [newUser.id, '{}', '{}', '{}', now],
  });

  return newUser;
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  await initDatabase();
  const db = getClient();
  const res = await db.execute({
    sql: 'SELECT * FROM user_progress WHERE userId = ? LIMIT 1',
    args: [userId],
  });

  if (res.rows.length === 0) {
    const now = new Date().toISOString();
    const newProgress: UserProgress = {
      userId,
      answers: {},
      starred: {},
      notes: {},
      updatedAt: now,
    };
    await db.execute({
      sql: 'INSERT INTO user_progress (userId, answers, starred, notes, updatedAt) VALUES (?, ?, ?, ?, ?)',
      args: [userId, '{}', '{}', '{}', now],
    });
    return newProgress;
  }

  const row = res.rows[0];
  return {
    userId: String(row.userId),
    answers: JSON.parse(String(row.answers || '{}')),
    starred: JSON.parse(String(row.starred || '{}')),
    notes: JSON.parse(String(row.notes || '{}')),
    updatedAt: String(row.updatedAt),
  };
}

export async function recordUserAnswer(
  userId: string,
  questionNumber: number,
  selectedAnswer: string
): Promise<UserProgress> {
  const progress = await getUserProgress(userId);
  const q = QUESTIONS_DATA.find(item => item.question_number === questionNumber);

  const official = (q?.correct_answer || '').toUpperCase().replace(/[^A-Z]/g, '');
  const userAns = selectedAnswer.toUpperCase().replace(/[^A-Z]/g, '');
  const isCorrect = official.includes(userAns) || userAns === official;

  progress.answers[questionNumber] = {
    selectedAnswer,
    isCorrect,
    timestamp: new Date().toISOString(),
  };
  progress.updatedAt = new Date().toISOString();

  const db = getClient();
  await db.execute({
    sql: 'UPDATE user_progress SET answers = ?, updatedAt = ? WHERE userId = ?',
    args: [JSON.stringify(progress.answers), progress.updatedAt, userId],
  });

  return progress;
}

export async function toggleUserStar(
  userId: string,
  questionNumber: number
): Promise<{ starred: boolean; progress: UserProgress }> {
  const progress = await getUserProgress(userId);
  const isStarred = !progress.starred[questionNumber];

  if (isStarred) {
    progress.starred[questionNumber] = true;
  } else {
    delete progress.starred[questionNumber];
  }

  progress.updatedAt = new Date().toISOString();
  const db = getClient();
  await db.execute({
    sql: 'UPDATE user_progress SET starred = ?, updatedAt = ? WHERE userId = ?',
    args: [JSON.stringify(progress.starred), progress.updatedAt, userId],
  });

  return { starred: isStarred, progress };
}

export async function resetUserProgress(userId: string): Promise<UserProgress> {
  const now = new Date().toISOString();
  const resetProgress: UserProgress = {
    userId,
    answers: {},
    starred: {},
    notes: {},
    updatedAt: now,
  };

  const db = getClient();
  await db.execute({
    sql: 'UPDATE user_progress SET answers = ?, starred = ?, notes = ?, updatedAt = ? WHERE userId = ?',
    args: ['{}', '{}', '{}', now, userId],
  });

  return resetProgress;
}

export async function saveExamAttempt(attempt: ExamAttempt): Promise<ExamAttempt> {
  await initDatabase();
  const db = getClient();

  await db.execute({
    sql: `INSERT INTO exam_attempts (
      id, userId, examType, domainKey, questionNumbers, answers, flagged, startedAt, completedAt, timeSpentSeconds, totalQuestions, score, scorePct, passed, domainScores
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      attempt.id,
      attempt.userId,
      attempt.examType,
      attempt.domainKey || null,
      JSON.stringify(attempt.questionNumbers),
      JSON.stringify(attempt.answers),
      JSON.stringify(attempt.flagged),
      attempt.startedAt,
      attempt.completedAt || new Date().toISOString(),
      attempt.timeSpentSeconds,
      attempt.totalQuestions,
      attempt.score,
      attempt.scorePct,
      attempt.passed ? 1 : 0,
      JSON.stringify(attempt.domainScores),
    ],
  });

  return attempt;
}

export async function getUserExamAttempts(userId: string): Promise<ExamAttempt[]> {
  await initDatabase();
  const db = getClient();
  const res = await db.execute({
    sql: 'SELECT * FROM exam_attempts WHERE userId = ? ORDER BY startedAt DESC',
    args: [userId],
  });

  return res.rows.map(row => ({
    id: String(row.id),
    userId: String(row.userId),
    examType: row.examType as 'full' | 'quick' | 'domain',
    domainKey: row.domainKey ? (row.domainKey as DomainKey) : undefined,
    questionNumbers: JSON.parse(String(row.questionNumbers || '[]')),
    answers: JSON.parse(String(row.answers || '{}')),
    flagged: JSON.parse(String(row.flagged || '{}')),
    startedAt: String(row.startedAt),
    completedAt: row.completedAt ? String(row.completedAt) : undefined,
    timeSpentSeconds: Number(row.timeSpentSeconds),
    totalQuestions: Number(row.totalQuestions),
    score: Number(row.score),
    scorePct: Number(row.scorePct),
    passed: Number(row.passed) === 1,
    domainScores: JSON.parse(String(row.domainScores || '{}')),
  }));
}

export async function getExamAttemptById(attemptId: string): Promise<ExamAttempt | null> {
  await initDatabase();
  const db = getClient();
  const res = await db.execute({
    sql: 'SELECT * FROM exam_attempts WHERE id = ? LIMIT 1',
    args: [attemptId],
  });

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    id: String(row.id),
    userId: String(row.userId),
    examType: row.examType as 'full' | 'quick' | 'domain',
    domainKey: row.domainKey ? (row.domainKey as DomainKey) : undefined,
    questionNumbers: JSON.parse(String(row.questionNumbers || '[]')),
    answers: JSON.parse(String(row.answers || '{}')),
    flagged: JSON.parse(String(row.flagged || '{}')),
    startedAt: String(row.startedAt),
    completedAt: row.completedAt ? String(row.completedAt) : undefined,
    timeSpentSeconds: Number(row.timeSpentSeconds),
    totalQuestions: Number(row.totalQuestions),
    score: Number(row.score),
    scorePct: Number(row.scorePct),
    passed: Number(row.passed) === 1,
    domainScores: JSON.parse(String(row.domainScores || '{}')),
  };
}

export async function getTeamLeaderboard(): Promise<TeamMemberStats[]> {
  await initDatabase();
  const db = getClient();
  const usersRes = await db.execute('SELECT id, username, fullName, createdAt FROM users');
  const attemptsRes = await db.execute('SELECT userId, scorePct FROM exam_attempts');
  const progressRes = await db.execute('SELECT userId, answers, updatedAt FROM user_progress');

  const statsList: TeamMemberStats[] = [];

  for (const userRow of usersRes.rows) {
    const userId = String(userRow.id);
    const progRow = progressRes.rows.find(p => String(p.userId) === userId);
    const answersObj: Record<string, { isCorrect: boolean }> = progRow ? JSON.parse(String(progRow.answers || '{}')) : {};
    
    const userAttempts = attemptsRes.rows.filter(a => String(a.userId) === userId);
    
    const answersList = Object.values(answersObj);
    const questionsPracticed = answersList.length;
    const correctAnswers = answersList.filter(a => a.isCorrect).length;
    const accuracyPct = questionsPracticed > 0 ? Math.round((correctAnswers / questionsPracticed) * 100) : 0;
    
    const mocksTaken = userAttempts.length;
    const bestMockScore = mocksTaken > 0 ? Math.max(...userAttempts.map(a => Number(a.scorePct))) : 0;
    
    const volumeScore = Math.min(100, Math.round((questionsPracticed / 574) * 100));
    const readinessPct = Math.round((volumeScore * 0.35) + (accuracyPct * 0.3) + (bestMockScore * 0.35));

    statsList.push({
      userId,
      username: String(userRow.username),
      fullName: String(userRow.fullName || userRow.username),
      questionsPracticed,
      accuracyPct,
      mocksTaken,
      bestMockScore,
      readinessPct,
      lastActive: progRow ? String(progRow.updatedAt) : String(userRow.createdAt),
    });
  }

  return statsList.sort((a, b) => b.readinessPct - a.readinessPct);
}
