import type { Question } from '../types';

let questions: Question[] = [
  {
    id: 'q1',
    title: 'Django ORM에서 N+1 쿼리 문제를 어떻게 해결하나요?',
    content:
      'Django에서 ForeignKey로 연결된 모델을 반복문에서 조회할 때마다 쿼리가 발생해 성능이 느려집니다. select_related 외에 다른 방법이 있을까요?',
    authorEmail: 'member@qanow.io',
    status: 'waiting',
    createdAt: '2026-08-19 14:20',
  },
  {
    id: 'q2',
    title: '회원 탈퇴 후 질문 기록은 어떻게 처리되나요?',
    content: '회원 탈퇴 시 이전에 작성한 질문이 어떻게 처리되는지 궁금합니다.',
    authorEmail: 'member@qanow.io',
    status: 'done',
    createdAt: '2026-08-17 09:03',
    answer: {
      id: 'a1',
      content:
        '탈퇴 시 개인을 식별할 수 있는 정보는 삭제되며, 질문 기록은 익명 처리되어 통계 목적으로만 보관됩니다.',
      adminEmail: 'admin@qanow.io',
      createdAt: '2026-08-17 11:30',
    },
  },
  {
    id: 'q3',
    title: '비밀번호 변경은 어디서 하나요?',
    content: '비밀번호를 변경하고 싶은데 어느 메뉴에서 할 수 있나요?',
    authorEmail: 'member@qanow.io',
    status: 'waiting',
    createdAt: '2026-08-15 18:47',
  },
];

/** Phase 3~4 Mock 저장소. Phase 6에서 Supabase 클라이언트 호출로 교체된다(design.md §6 Mock 예외 조항). */
export function listQuestions(): Question[] {
  return questions;
}

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function createQuestion(input: {
  title: string;
  content: string;
  authorEmail: string;
}): Question {
  const question: Question = {
    id: `q${Date.now()}`,
    title: input.title,
    content: input.content,
    authorEmail: input.authorEmail,
    status: 'waiting',
    createdAt: new Date().toISOString(),
  };
  questions = [question, ...questions];
  return question;
}

export function updateQuestion(id: string, patch: { title: string; content: string }): void {
  questions = questions.map((q) => (q.id === id ? { ...q, ...patch } : q));
}

export function deleteQuestion(id: string): void {
  questions = questions.filter((q) => q.id !== id);
}

export function submitAnswer(questionId: string, content: string, adminEmail: string): void {
  questions = questions.map((q) =>
    q.id === questionId
      ? {
          ...q,
          status: 'done',
          answer: {
            id: q.answer?.id ?? `a${Date.now()}`,
            content,
            adminEmail,
            createdAt: new Date().toISOString(),
          },
        }
      : q,
  );
}
