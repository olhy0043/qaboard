import { Link } from 'react-router-dom';
import { Badge } from '../Badge';
import type { Question } from '../../types';
import './QuestionRow.css';

interface QuestionRowProps {
  question: Question;
  showAuthor: boolean;
}

/** design.md §11 질문 리스트 카드(행) 구조의 단일 구현 (ListPage에서 추출, 재사용 일관성 보정). */
export function QuestionRow({ question, showAuthor }: QuestionRowProps) {
  return (
    <Link to={`/questions/${question.id}`} className="q-row">
      <div className="q-main">
        <div className="q-title">{question.title}</div>
        <div className="q-meta">
          {showAuthor && <span>{question.authorEmail} ·</span>}
          <span>{question.createdAt}</span>
        </div>
      </div>
      <Badge status={question.status} />
    </Link>
  );
}
