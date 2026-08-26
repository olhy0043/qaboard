-- T046: profiles 테이블 — 회원/관리자 계정 (Spec §Key Entities)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- FR-003: 각 계정은 정확히 하나의 역할을 가진다. 본인 프로필만 조회 가능.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- 회원가입 시 auth.users에 새 행이 생기면 profiles 행을 자동 생성 (FR-001).
-- role은 기본값 'member'로만 생성되며, 관리자 승격은 이 트리거가 아닌 별도
-- 운영 절차로 수행한다(Spec Assumptions: 관리자는 사전에 부여).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
