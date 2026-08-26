-- T049: 회원은 본인 질문만 조회/수정/삭제, 답변완료 질문은 수정·삭제 불가
-- (FR-010, FR-013, FR-014, FR-015, FR-021, 헌법 원칙 II)

create policy "questions_select_own"
  on public.questions for select
  using (author_id = auth.uid());

create policy "questions_insert_own"
  on public.questions for insert
  with check (author_id = auth.uid());

-- FR-015: 답변 등록 후에는 소유자 본인의 수정 요청도 데이터 계층에서 거부한다.
create policy "questions_update_own_pending"
  on public.questions for update
  using (author_id = auth.uid() and status <> 'done')
  with check (author_id = auth.uid() and status <> 'done');

create policy "questions_delete_own_pending"
  on public.questions for delete
  using (author_id = auth.uid() and status <> 'done');
