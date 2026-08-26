-- T050: 관리자는 전체 질문 조회 가능 (FR-011). 관리자는 questions에 대한
-- INSERT/UPDATE/DELETE 정책을 갖지 않는다 — 답변 등록/수정으로 인한 status 전이는
-- 0003 마이그레이션의 SECURITY DEFINER 트리거만으로 처리한다(최소 권한 원칙).

create policy "questions_select_admin"
  on public.questions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
