-- T048 + T079: answers 테이블 — FR-016~FR-019, FR-017 길이 검증(헌법 III)
-- 질문 1건당 답변은 최대 1건 (Spec §Key Entities) → question_id UNIQUE.
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references public.questions(id) on delete cascade,
  content text not null,
  admin_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint answers_content_length
    check (char_length(btrim(content)) between 1 and 5000)
);

alter table public.answers enable row level security;

-- FR-018: 답변이 등록되면 해당 질문의 상태를 '답변 완료'로 변경한다.
-- 관리자에게 questions 테이블에 대한 넓은 UPDATE 권한을 주지 않고, 이 트리거만으로
-- 상태 전이를 강제한다(0005 마이그레이션의 관리자 RLS와 결합해 최소 권한 유지).
create or replace function public.mark_question_done()
returns trigger as $$
begin
  update public.questions
     set status = 'done', updated_at = now()
   where id = new.question_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger answers_after_insert
  after insert on public.answers
  for each row execute function public.mark_question_done();
