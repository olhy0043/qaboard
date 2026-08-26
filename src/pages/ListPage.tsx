import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatePanel, LoadingSkeleton } from '../components/StatePanel';
import { QuestionRow } from '../components/questions/QuestionRow';
import { useSession } from '../mocks/mockSession';
import { listQuestions } from '../mocks/mockData';
import type { QuestionStatus } from '../types';
import './ListPage.css';

type Filter = 'all' | QuestionStatus;

/** FR-010/FR-011: 회원은 본인 질문만, 관리자는 전체 질문을 상태별로 필터링해 조회. */
export function ListPage() {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const t = setTimeout(() => {
      // Mock 단계에는 실패할 비동기 소스가 없어 catch가 실행되지 않는다.
      // Phase 6에서 실제 fetch로 교체되면 이 catch에서 setError(true)를 호출한다.
      try {
        listQuestions();
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [retryKey]);

  const isAdmin = session?.role === 'admin';

  const scoped = useMemo(() => {
    if (!session) return [];
    const all = listQuestions();
    return isAdmin ? all : all.filter((q) => q.authorEmail === session.email);
  }, [isAdmin, session]);

  if (!session) return null;

  const filtered = filter === 'all' ? scoped : scoped.filter((q) => q.status === filter);

  return (
    <div className="container">
      <PageHeader
        title={isAdmin ? '문의 관리' : '내 질문'}
        subtitle={
          isAdmin
            ? '전체 회원의 질문을 상태별로 확인하세요'
            : '작성한 질문과 답변 상태를 확인하세요'
        }
        actions={
          <Link to="/questions/new">
            <Button>+ 새 질문 작성</Button>
          </Link>
        }
      />

      <div className="filter-tabs" role="tablist" aria-label="질문 상태 필터">
        {(['all', 'waiting', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            aria-pressed={filter === f}
            className={`filter-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '모두' : f === 'waiting' ? '답변 대기' : '답변 완료'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="list">
          <LoadingSkeleton lines={2} />
          <LoadingSkeleton lines={2} />
          <LoadingSkeleton lines={2} />
        </div>
      ) : error ? (
        <StatePanel
          icon="⚠️"
          title="문제가 발생했습니다"
          description="나중에 다시 시도해주세요."
          action={
            <div className="state-actions">
              <Button variant="secondary" onClick={() => setRetryKey((k) => k + 1)}>
                다시 시도
              </Button>
              <Link to="/">
                <Button>홈으로</Button>
              </Link>
            </div>
          }
        />
      ) : filtered.length === 0 ? (
        <StatePanel
          icon="📝"
          title={isAdmin ? '답변 대기 중인 질문이 없습니다' : '아직 질문이 없습니다'}
          description={
            isAdmin ? '필터를 변경해 다른 상태의 질문을 확인해보세요.' : '첫 질문을 남겨보세요!'
          }
          action={
            isAdmin ? (
              <Button onClick={() => setFilter('all')}>필터 변경</Button>
            ) : (
              <Link to="/questions/new">
                <Button>질문 작성하기</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="list">
          {filtered.map((q) => (
            <QuestionRow key={q.id} question={q} showAuthor={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
