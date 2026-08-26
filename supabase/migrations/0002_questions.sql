-- T047 + T079: questions 테이블 — FR-006~FR-015, FR-007/FR-008 길이 검증(헌법 III)
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_title_length
    check (char_length(btrim(title)) between 1 and 100),
  constraint questions_content_length
    check (char_length(btrim(content)) between 1 and 5000)
);

alter table public.questions enable row level security;

create index questions_author_id_idx on public.questions (author_id);
