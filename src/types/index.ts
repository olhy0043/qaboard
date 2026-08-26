export type Role = 'member' | 'admin';
export type QuestionStatus = 'waiting' | 'done';

export interface Session {
  email: string;
  role: Role;
}

export interface Answer {
  id: string;
  content: string;
  adminEmail: string;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  status: QuestionStatus;
  createdAt: string;
  answer?: Answer;
}
