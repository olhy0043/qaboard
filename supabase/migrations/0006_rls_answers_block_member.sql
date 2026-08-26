-- T051: 답변은 인증된 사용자 누구나 조회 가능(질문 소유자/관리자 모두 상세에서 필요),
-- 작성·수정은 관리자만 가능 — 회원의 답변 작성/수정을 데이터 계층에서 차단
-- (FR-016, FR-019, FR-020, 헌법 원칙 II)

create policy "answers_select_authenticated"
  on public.answers for select
  using (auth.role() = 'authenticated');

create policy "answers_insert_admin_only"
  on public.answers for insert
  with check (
    admin_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "answers_update_admin_only"
  on public.answers for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
