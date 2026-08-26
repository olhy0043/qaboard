# Implementation Plan: QANOW 질문·답변 게시판

**Status**: Draft (checklist 보정용 최소 버전)
**Feature**: [spec.md](./spec.md) · [design.md](./design.md) · [tasks.md](./tasks.md)
**Created**: 2026-08-21

이 문서는 `/speckit-tasks`가 이미 상세 Phase/Task로 분해해 둔 실행 계획(tasks.md)을
대체하지 않는다. `plan-design-readiness` 체크리스트에서 "plan.md에 정의되어
있는가?"로 지적된 6개 기술 결정(CHK022, 024, 032~035)만 최소한으로 명문화한다.

## 1. 기술 스택

React 18 + Vite + TypeScript. 상태 관리 라이브러리 없음(useState/useContext로
충분, 헌법 원칙 XI: MVP 단순성). 라우팅은 React Router 최소 구성(`/`, `/questions`,
`/questions/:id`, `/questions/new`).

## 2. 디자인 토큰 → CSS 변환 방법 (CHK022 해소)

design.md §15의 CSS 커스텀 프로퍼티를 **그대로** `src/styles/tokens.css`의
`:root` 블록에 복사한다. 별도의 빌드타임 변환(Sass 변수, JS 테마 객체 등)을
두지 않는다 — Claude Design 확정본이 이미 순수 CSS 커스텀 프로퍼티로 작성되어
있으므로, 값 손실 없이 1:1로 옮기는 것이 가장 단순한 경로다(헌법 XI). 이후
모든 컴포넌트 CSS는 이 파일의 `var(--토큰명)`만 참조하고 색상 리터럴을 직접
쓰지 않는다. 대상 파일: `src/styles/tokens.css` (tasks.md T006).

## 3. 메인 Hero 시각 효과 구현 기술 (CHK024 해소)

세 효과 모두 **순수 CSS**로 구현하며 JS 애니메이션 라이브러리를 추가하지 않는다:

- Aurora Gradient: CSS `@keyframes aurora` + `background-position` 이동
- Grid Glow: 정적 `background-image` (애니메이션 없음)
- Floating Card: CSS `@keyframes float1` (`translateY` ±10px), 1024px 이하
  전환은 미디어쿼리로 처리(design.md §10 "구현 기법" 참조)

모든 keyframe 애니메이션은 `@media (prefers-reduced-motion: no-preference)`
안에 선언한다(헌법 VII). 대상 파일: `src/pages/MainPage.module.css`,
`src/components/FloatingCards.tsx`(tasks.md T019, T020).

## 4. 역할 판정 교체 방법 — Mock → 실제 인증 (CHK032 해소)

Phase 3~4에서는 `src/mocks/mockSession.ts`가 `{ role: 'member' | 'admin' }`를
반환하는 동일한 인터페이스를 제공한다. Phase 5~6에서 `src/hooks/useAuth.ts`가
이 인터페이스를 유지한 채 내부 구현만 교체한다: Supabase 세션의 `user.id`로
`profiles` 테이블을 조회해 `role` 컬럼 값을 반환한다. 컴포넌트 쪽 코드는
`useAuth()` 훅 시그니처가 동일하므로 수정이 필요 없다(tasks.md T016, T052, T053).

## 5. 구현 순서 게이트 (CHK033~035 해소)

```
Phase 1(설정) → Phase 2(디자인 시스템) → Phase 3(Mock UI)
  → [게이트 A: 로컬 수동 검증 — design.md §24 체크리스트 통과]
  → Phase 4(/design-sync 실행 + CRITICAL/HIGH 수정)
  → [게이트 B: design-sync 재검증 통과, design-sync-log.md 작성 완료]
  → Phase 5(Supabase: 스키마 + RLS)
  → Phase 6/7(회원/관리자 기능, 병렬 가능) → Phase 8(테스트/최종검증)
```

- **게이트 A 완료 기준**: tasks.md T036(1440px/390px 수동 검증) 통과.
- **게이트 B 완료 기준**: tasks.md T042(design.md §24 체크리스트 11개 항목 전부
  확인) 통과 + T043(design-sync-log.md 작성) 완료.
- 게이트 A·B를 통과하지 못한 상태에서 Phase 5 이후 Task(Supabase 스키마,
  RLS, 실제 데이터 연동)를 시작하지 않는다. 이 순서는 tasks.md
  "Dependencies & Execution Order" 섹션과 동일하며, 본 문서는 그 요약이다.

## 6. 비고

세부 Task 단위 실행 계획, 파일 경로, 검증 방법은 [tasks.md](./tasks.md)를
단일 진실 공급원(SSOT)으로 유지한다. 이 plan.md는 tasks.md에 없던 "왜 이
방식을 택했는가"에 대한 기술 결정 근거만 보충한다.
