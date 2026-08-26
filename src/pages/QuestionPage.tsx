import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { Overlay } from '../components/Overlay';
import { StatePanel, LoadingSkeleton } from '../components/StatePanel';
import { useSession } from '../mocks/mockSession';
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  submitAnswer,
  updateQuestion,
} from '../mocks/mockData';
import { validateAnswer, validateContent, validateTitle } from '../lib/validation';
import type { Question } from '../types';
import './QuestionPage.css';

type Mode = 'new' | 'view' | 'edit';

/** FR-006/FR-012/FR-013/FR-016/FR-019: 질문 작성·상세·수정·답변 작성/수정을 한 페이지에서 처리. */
export function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const isNew = id === undefined;

  const [loading, setLoading] = useState(!isNew);
  const [retryKey, setRetryKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [mode, setMode] = useState<Mode>(isNew ? 'new' : 'view');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState<string>();
  const [contentError, setContentError] = useState<string>();

  const [answerText, setAnswerText] = useState('');
  const [answerError, setAnswerError] = useState<string>();

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    const t = setTimeout(() => {
      const q = getQuestion(id!);
      setQuestion(q);
      if (q) {
        setTitle(q.title);
        setContent(q.content);
        setAnswerText(q.answer?.content ?? '');
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [id, isNew, retryKey]);

  if (!session) return null;
  const isAdmin = session.role === 'admin';

  if (isNew) {
    const handleCreate = () => {
      const tErr = validateTitle(title);
      const cErr = validateContent(content);
      setTitleError(tErr);
      setContentError(cErr);
      if (tErr || cErr) return;
      setSaving(true);
      setTimeout(() => {
        createQuestion({ title, content, authorEmail: session!.email });
        navigate('/questions');
      }, 500);
    };

    return (
      <div className="container narrow page-pad">
        <div className="crumb">
          <Link to="/questions">← 목록으로 돌아가기</Link>
        </div>
        <PageHeader title="새 질문 작성" size="detail" bordered />
        {saving ? <SavingOverlay /> : null}
        <Input
          id="title"
          label="질문 제목"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          placeholder="질문을 간결하게 입력하세요"
          disabled={saving}
        />
        <Textarea
          id="content"
          label="질문 내용"
          maxLength={5000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={contentError}
          placeholder="궁금한 점을 자세히 설명해주세요"
          disabled={saving}
        />
        <div className="form-actions">
          <Button onClick={handleCreate} disabled={saving}>
            저장
          </Button>
          <Button variant="secondary" onClick={() => navigate('/questions')} disabled={saving}>
            취소
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container narrow page-pad">
        <div className="crumb">
          <Link to="/questions">← 목록으로 돌아가기</Link>
        </div>
        <LoadingSkeleton lines={5} />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container narrow page-pad">
        <StatePanel
          icon="⚠️"
          title="문제가 발생했습니다."
          description="질문을 찾을 수 없습니다."
          action={
            <div className="state-actions">
              <Button variant="secondary" onClick={() => setRetryKey((k) => k + 1)}>
                다시 시도
              </Button>
              <Link to="/questions">
                <Button>목록으로 돌아가기</Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  // FR-021: 회원이 타인의 질문에 접근하면 권한 없음.
  if (!isAdmin && question.authorEmail !== session.email) {
    return (
      <div className="container narrow page-pad">
        <StatePanel
          icon="🔒"
          title="이 질문에 접근할 권한이 없습니다."
          action={
            <Link to="/questions">
              <Button>목록으로 돌아가기</Button>
            </Link>
          }
        />
      </div>
    );
  }

  function handleDelete() {
    if (!window.confirm('이 질문을 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다.')) return;
    deleteQuestion(question!.id);
    navigate('/questions');
  }

  function handleSaveEdit() {
    const tErr = validateTitle(title);
    const cErr = validateContent(content);
    setTitleError(tErr);
    setContentError(cErr);
    if (tErr || cErr) return;
    updateQuestion(question!.id, { title, content });
    setMode('view');
    setQuestion({ ...question!, title, content });
  }

  function handleSaveAnswer() {
    const aErr = validateAnswer(answerText);
    setAnswerError(aErr);
    if (aErr) return;
    setSaving(true);
    setTimeout(() => {
      submitAnswer(question!.id, answerText, session!.email);
      navigate('/questions');
    }, 500);
  }

  if (mode === 'edit') {
    return (
      <div className="container narrow page-pad">
        <div className="crumb">
          <Link to="/questions">← 목록으로 돌아가기</Link>
        </div>
        <PageHeader title="질문 수정" size="detail" bordered />
        <Input
          id="title"
          label="질문 제목"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
        />
        <Textarea
          id="content"
          label="질문 내용"
          maxLength={5000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={contentError}
        />
        <div className="form-actions">
          <Button onClick={handleSaveEdit}>저장</Button>
          <Button variant="secondary" onClick={() => setMode('view')}>
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container narrow page-pad">
      <div className="crumb">
        <Link to="/questions">← 목록으로 돌아가기</Link>
      </div>
      {saving && <SavingOverlay />}
      <PageHeader
        title={question.title}
        size="detail"
        bordered
        actions={
          !isAdmin &&
          question.status === 'waiting' && (
            <div className="q-actions">
              <Button variant="secondary" size="sm" onClick={() => setMode('edit')}>
                수정
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          )
        }
        meta={
          <div className="q-meta">
            <Badge status={question.status} />
            <span>{question.authorEmail}</span>
            <span>· {question.createdAt}</span>
          </div>
        }
      />
      <div className="q-body">{question.content}</div>

      <div className="answer-block">
        {isAdmin ? (
          <>
            <div className="answer-block-title">
              {question.status === 'waiting' ? '관리자 답변 작성' : '관리자 답변 수정'}
            </div>
            <Textarea
              id="answer"
              label="답변 내용"
              maxLength={5000}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              error={answerError}
              placeholder="명확하고 친절한 답변을 작성해주세요"
              disabled={saving}
            />
            <div className="form-actions">
              <Button onClick={handleSaveAnswer} disabled={saving}>
                답변 저장
              </Button>
              <Link to="/questions">
                <Button variant="secondary" disabled={saving}>
                  취소
                </Button>
              </Link>
            </div>
          </>
        ) : question.status === 'waiting' ? (
          <>
            <div className="answer-block-title">관리자 답변</div>
            <div className="waiting-note">
              ⏳ 아직 답변이 등록되지 않았습니다. 관리자 확인 후 답변이 등록됩니다.
            </div>
          </>
        ) : (
          <>
            <div className="answer-block-title">관리자 답변</div>
            <div className="answer-card">
              <div className="q-body">{question.answer?.content}</div>
              <div className="answer-meta">
                {question.answer?.adminEmail} · {question.answer?.createdAt}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SavingOverlay() {
  return (
    <Overlay tone="scrim-soft" role="status" aria-live="assertive">
      <div className="saving-box">
        <span className="spinner" aria-hidden="true" /> 저장 중입니다…
      </div>
    </Overlay>
  );
}
