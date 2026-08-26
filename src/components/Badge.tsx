import './Badge.css';

export type QuestionStatus = 'waiting' | 'done';

const LABEL: Record<QuestionStatus, string> = {
  waiting: '⏳ 답변 대기 중',
  done: '✓ 답변 완료',
};

export function Badge({ status }: { status: QuestionStatus }) {
  return <span className={`badge badge-${status}`}>{LABEL[status]}</span>;
}
