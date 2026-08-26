---

description: "Task list for QANOW 질문·답변 게시판 구현"
---

# Tasks: QANOW 질문·답변 게시판

**Input**: [spec.md](./spec.md), [design.md](./design.md) — `plan.md`는 아직 생성되지 않았음
(`/speckit-plan` 미실행). 아래 Phase 구조는 사용자가 명시적으로 제공한 구조를
그대로 사용했으며, plan.md 대체 근거는 design.md와 constitution.md다.

**Prerequisites**: spec.md(필수), design.md(필수), constitution.md(참조),
checklists/plan-design-readiness.md(구현 착수 전 리뷰 대상)

**Tests**: 통합/단위 테스트는 Phase 8에 포함하며, 그 외 Phase에서는 명시적으로
요청된 검증 항목만 포함한다.

**Organization**: 사용자가 요청한 8개 Phase로 조직한다(회원/관리자 기능 Phase는
spec.md 사용자 스토리 [US1]~[US4]로 세부 라벨을 병기한다).

## Format: `[ID] [P?] [Story?] Description (파일 경로)`

각 Task는 아래 4개 항목을 하위 불릿으로 포함한다: **요구사항**, **design.md**,
**파일**, **검증**.

- **[P]**: 병렬 실행 가능(다른 파일, 선행 미완료 Task에 의존하지 않음)
- **[US1]/[US2]/[US3]/[US4]**: spec.md 사용자 스토리 매핑
  (US1=회원 질문·상태추적 P1, US2=관리자 답변 P1, US3=비회원 이해→로그인 P2,
  US4=회원 수정·삭제 P3)

## Path Conventions

React + Vite + TypeScript 단일 프론트엔드 프로젝트 기준:
`src/components/`, `src/pages/`, `src/styles/`, `src/mocks/`, `src/lib/`,
`src/hooks/`, `src/types/`, `tests/`

---

## Phase 1: 프로젝트 설정

**Purpose**: 프로젝트 초기화와 개발 도구 설정

- [X] T001 Vite + React + TypeScript 프로젝트 초기화 (`package.json`, `vite.config.ts`, `tsconfig.json`)
  - 요구사항: 없음(인프라)
  - design.md: 없음
  - 파일: `package.json`, `vite.config.ts`, `tsconfig.json`
  - 검증: `npm run dev`로 빈 앱이 기동되는지 확인 — `npm run build` 성공으로 대체 확인(2026-08-21)
- [X] T002 [P] ESLint + Prettier 설정 (`.eslintrc.cjs`, `.prettierrc`)
  - 요구사항: 없음(인프라)
  - design.md: 없음
  - 파일: `.eslintrc.cjs`, `.prettierrc`
  - 검증: `npm run lint` 종료 코드 0 — 확인 완료(2026-08-21, "No issues found")
- [X] T003 [P] Vitest + React Testing Library 설정 (`vitest.config.ts`, `src/setupTests.ts`)
  - 요구사항: 헌법 XIII(테스트/빌드 게이트)
  - design.md: 없음
  - 파일: `vitest.config.ts`, `src/setupTests.ts`, `src/App.test.tsx`(샘플)
  - 검증: `npm run test` 실행 시 샘플 테스트 통과 — 확인 완료(2026-08-21, 1 passed)
- [X] T004 [P] 빌드 스크립트 검증 (`package.json` scripts)
  - 요구사항: 헌법 XIII
  - design.md: 없음
  - 파일: `package.json`
  - 검증: `npm run build`가 `dist/`를 오류 없이 생성 — 확인 완료(2026-08-21)
- [ ] T005 폴더 구조 생성 (`src/components`, `src/pages`, `src/styles`, `src/mocks`, `src/lib`, `src/hooks`, `src/types`)
  - 요구사항: 없음(인프라)
  - design.md: §3~4 (세 화면·컴포넌트 경계)
  - 파일: 위 디렉터리 전체
  - 검증: 각 디렉터리에 `.gitkeep` 또는 최초 파일 존재 (Phase 2 착수 시 자연스럽게 생성 예정)

**Checkpoint**: 개발 환경 준비 완료

---

## Phase 2: 디자인 시스템 기반 (Blocking Prerequisites)

**Purpose**: 세 화면이 공유하는 컴포넌트·토큰·전역 규칙. **Phase 3 착수 전 필수 완료**.

**⚠️ CRITICAL**: 이 Phase 완료 전 Phase 3 작업을 시작하지 않는다.

- [X] T006 [P] CSS 디자인 토큰 정의 (`src/styles/tokens.css`)
  - 요구사항: 헌법 원칙 V(일관성)
  - design.md: §15 (디자인 토큰: `--navy`, `--blue`, `--violet`, `--badge-waiting`, `--badge-done` 등)
  - 파일: `src/styles/tokens.css`
  - 검증: design.md §15의 모든 토큰 값 1:1 반영 확인 완료(2026-08-21)
- [X] T007 [P] 전역 리셋/기본 스타일 (`src/styles/global.css`)
  - 요구사항: 없음
  - design.md: §18(간격/최대폭), §19(버튼·입력·카드·배지 공통 규칙)
  - 파일: `src/styles/global.css`
  - 검증: `.container` max-width:1200px + 반응형 패딩 규칙 반영 확인
- [X] T008 [P] 타이포그래피 스타일 (`src/styles/typography.css`)
  - 요구사항: 없음
  - design.md: §16 (타이포그래피 계층)
  - 파일: `src/styles/typography.css`
  - 검증: §16 표의 8개 용도별 크기/굵기 클래스(`text-h1`~`text-xsmall`) 존재 확인
- [X] T009 Header/Navigation 컴포넌트 (`src/components/Header.tsx`)
  - 요구사항: FR-002(로그인/로그아웃)
  - design.md: §7 (Header/Navigation 규칙)
  - 파일: `src/components/Header.tsx`, `src/components/Header.css`
  - 검증: 데스크톱 56px/모바일 48px 높이, 로고 Link가 `/`로 연결됨 확인(빌드 통과, Phase 3에서 페이지 연동 예정)
- [X] T010 [P] Button 컴포넌트 (`src/components/Button.tsx`)
  - 요구사항: 없음(공통 UI)
  - design.md: §19 (Primary/Secondary/Danger, 44px, disabled 대비)
  - 파일: `src/components/Button.tsx`, `src/components/Button.css`
  - 검증: 44px 높이, 3종 variant + sm 사이즈, disabled 시 `--gray-500` 텍스트 확인
- [X] T011 [P] Input/Textarea 컴포넌트 (`src/components/Input.tsx`, `src/components/Textarea.tsx`)
  - 요구사항: FR-007, FR-008, FR-017 (길이 규칙 표시)
  - design.md: §12, §19
  - 파일: `src/components/Input.tsx`, `src/components/Textarea.tsx`, `src/components/Field.css`
  - 검증: 글자 수 힌트(`{length}/{maxLength}`) 표시, 포커스 시 2px 블루 아웃라인 확인
- [X] T012 [P] Badge 컴포넌트 (`src/components/Badge.tsx`)
  - 요구사항: FR-023, 헌법 원칙 IX(색상+텍스트 병기)
  - design.md: §15, §17, §19
  - 파일: `src/components/Badge.tsx`, `src/components/Badge.css`
  - 검증: waiting/done 배지가 아이콘+텍스트 포함, 배경이 `--badge-waiting`/`--badge-done` 사용(원색 아님) 확인
- [X] T013 [P] StatePanel 컴포넌트 — Loading/Empty/Error/Unauthorized (`src/components/StatePanel.tsx`)
  - 요구사항: FR-021, FR-023, FR-024
  - design.md: §14
  - 파일: `src/components/StatePanel.tsx`, `src/components/StatePanel.css`
  - 검증: 아이콘+제목+설명+액션 슬롯을 갖춘 `StatePanel`과 `LoadingSkeleton` 컴포넌트 렌더 확인
- [X] T014 전역 focus-visible 및 reduced-motion 유틸리티 (`src/styles/global.css`, `src/styles/motion.css`)
  - 요구사항: 헌법 원칙 VII, VIII
  - design.md: §21, §22
  - 파일: `src/styles/global.css`, `src/styles/motion.css`
  - 검증: `:focus-visible` 전역 규칙 존재, `aurora`/`float1`/`shimmer`/`spin` keyframe이 motion.css에 정의되어 각 컴포넌트가 reduced-motion 가드 안에서만 참조하도록 준비됨

**Checkpoint**: 디자인 시스템 컴포넌트 준비 완료 — 화면 구현 착수 가능

---

## Phase 3: 세 핵심 화면과 Mock Data

**Purpose**: Supabase 연결 없이 Mock Data/Mock Session으로 세 화면을 완성한다.

**Dependencies**: Phase 2 완료 필수.

### Mock 기반 (Phase 3 내 선행 작업)

- [X] T015 [P] Mock 질문/답변 데이터 (`src/mocks/mockData.ts`)
  - 요구사항: Spec §Key Entities
  - design.md: §11, §13
  - 파일: `src/mocks/mockData.ts`
  - 검증: 답변 대기/완료 질문이 각각 최소 1건 포함
- [X] T016 [P] Mock 세션/역할 스위처 (`src/mocks/mockSession.tsx`)
  - 요구사항: Spec §Key Entities(회원/관리자)
  - design.md: §6
  - 파일: `src/mocks/mockSession.tsx` (JSX Provider 포함으로 .tsx 확장자 사용, tasks.md 원안 대비 확장자만 변경)
  - 검증: `email.startsWith('admin')`으로 role 판정, 로그인/로그아웃/모달 상태 관리 확인(빌드·테스트 통과)
- [X] T017 [P] 공용 TypeScript 타입 정의 (`src/types/index.ts`)
  - 요구사항: Spec §Key Entities
  - design.md: 없음
  - 파일: `src/types/index.ts`
  - 검증: `Question`, `Answer`, `Session(role)` 타입이 spec.md 필드와 1:1 대응 확인

### 메인 페이지

- [X] T018 MainPage 컴포넌트 (`src/pages/MainPage.tsx`)
  - 요구사항: FR-004
  - design.md: §9
  - 파일: `src/pages/MainPage.tsx`
  - 검증: 서비스명·메인카피·서브카피·3단계 흐름 텍스트가 design.md §2와 일치
- [X] T019 [P] Aurora Hero 배경 스타일 (`src/pages/MainPage.css`)
  - 요구사항: 헌법 원칙 VI
  - design.md: §10
  - 파일: `src/pages/MainPage.css`
  - 검증: `linear-gradient(135deg, navy, blue, violet)` + 60px grid overlay 코드 반영 확인(빌드 통과)
- [X] T020 Floating Card 컴포넌트 (`src/components/FloatingCards.tsx`)
  - 요구사항: 없음(장식)
  - design.md: §10
  - 파일: `src/components/FloatingCards.tsx`, `src/components/FloatingCards.css`
  - 검증: 1024px 이하 미디어쿼리로 정적 레이아웃 전환, 연결선 숨김 코드 확인
- [X] T021 LoginModal 컴포넌트 (`src/components/LoginModal.tsx`)
  - 요구사항: FR-005, FR-022
  - design.md: §5
  - 파일: `src/components/LoginModal.tsx`, `src/components/LoginModal.css`
  - 검증: `role="dialog" aria-modal="true"`, 오버레이 클릭으로 닫힘, autoFocus로 이메일 입력에 포커스
- [X] T022 헤더/Hero CTA를 LoginModal + mock 이동에 연결 (`src/pages/MainPage.tsx`)
  - 요구사항: FR-005, FR-022
  - design.md: §5
  - 파일: `src/pages/MainPage.tsx`, `src/components/Layout.tsx`
  - 검증: 비로그인 상태에서 "질문 작성하기"/"내 질문 확인하기"/헤더 "로그인" 클릭 시 `requestLogin()`으로 모달이 열리고, 로그인 성공 시 `pendingRedirect`로 이동(코드 검토 및 빌드 통과로 확인, 실제 브라우저 클릭 검증은 확장 미연결로 미수행 — 아래 T036 참조)

### 질문 리스트 페이지

- [X] T023 [US1] ListPage 컴포넌트 (`src/pages/ListPage.tsx`)
  - 요구사항: FR-010, FR-011
  - design.md: §11
  - 파일: `src/pages/ListPage.tsx`, `src/pages/ListPage.css`
  - 검증: `session.role`이 member일 때 "내 질문", admin일 때 "문의 관리" 제목 표시(코드 확인)
- [X] T024 [US1] 필터 탭 구현 — 모두/답변대기/답변완료 (`src/pages/ListPage.tsx`)
  - 요구사항: FR-010, FR-011
  - design.md: §11
  - 파일: `src/pages/ListPage.tsx`
  - 검증: `filter` state로 목록이 필터링되는 로직 확인
- [X] T025 [P] [US1] 질문 행 마크업 (`src/pages/ListPage.tsx` 내 인라인 구현)
  - 요구사항: Spec §Key Entities
  - design.md: §11
  - 파일: `src/pages/ListPage.tsx`, `src/pages/ListPage.css`
  - 검증: 640px 이하 미디어쿼리로 세로 스택 전환, 관리자 뷰에서만 작성자 이메일 표시(코드 확인).
    별도 `QuestionRow.tsx` 컴포넌트로 분리하지 않고 ListPage 내부에 인라인 구현 — 헌법 XI(MVP
    단순성), 재사용처가 ListPage 하나뿐이라 조기 추상화하지 않음
- [X] T026 [US1] Empty/Loading/Error 상태 연동 (`src/pages/ListPage.tsx`)
  - 요구사항: FR-023, FR-024
  - design.md: §14
  - 파일: `src/pages/ListPage.tsx`
  - 검증: 역할별 Empty 문구(FR-024) 및 CTA 분기 확인. Loading은 300ms 지연으로 시뮬레이션.
    Error 상태는 StatePanel 컴포넌트로 준비되어 있으나 Mock 단계에는 실패할 비동기 소스가 없어
    실제 트리거 없음 — Phase 6 실제 fetch 연동 시 try/catch로 연결 예정
- [X] T027 [US1] 역할 기반 범위 필터링 (mock) (`src/pages/ListPage.tsx`)
  - 요구사항: FR-010, FR-011
  - design.md: §6
  - 파일: `src/pages/ListPage.tsx`
  - 검증: `isAdmin ? all : all.filter(authorEmail === session.email)` 로직 확인

### 질문 페이지

- [X] T028 QuestionPage 컴포넌트 및 상태 라우팅 (`src/pages/QuestionPage.tsx`)
  - 요구사항: FR-006, FR-012
  - design.md: §12, §13
  - 파일: `src/pages/QuestionPage.tsx`, `src/pages/QuestionPage.css`
  - 검증: `isNew`/`loading`/`!question`(오류)/unauthorized/`mode==='edit'`/기본 뷰 순서로
    분기해 `new`/`detail`/`edit`/`unauthorized`/`loading`/`error`/`saving` 상태 모두 렌더링 확인
- [X] T029 [US1] 질문 작성/수정 폼 + 글자수/유효성 (`src/pages/QuestionPage.tsx`)
  - 요구사항: FR-007, FR-008, FR-013
  - design.md: §12
  - 파일: `src/pages/QuestionPage.tsx`, `src/lib/validation.ts`
  - 검증: `validateTitle`/`validateContent`가 trim 후 1~100/1~5000자 범위를 벗어나면 오류 문구 반환(코드 확인)
- [X] T030 [US1] 질문 상세 + 답변 표시(회원 뷰) (`src/pages/QuestionPage.tsx`)
  - 요구사항: FR-012
  - design.md: §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: 답변 대기 시 `waiting-note`, 답변 완료 시 `answer-card` 분기 렌더링 확인
- [X] T031 [US2] 관리자 답변 작성/수정 폼 (`src/pages/QuestionPage.tsx`)
  - 요구사항: FR-016, FR-017, FR-019
  - design.md: §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: `question.status==='waiting'`이면 작성 폼, `'done'`이면 `answerText` 기존 값이 채워진
    수정 폼이 표시되는 분기 확인
- [X] T032 Unauthorized/Loading/Error/Saving 상태 연동 (`src/pages/QuestionPage.tsx`)
  - 요구사항: FR-021, FR-023
  - design.md: §14
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: `!isAdmin && authorEmail !== session.email` 시 unauthorized, `saving` true일 때
    `SavingOverlay` 표시 후 네비게이션 확인
- [X] T033 [US4] 삭제 확인 플로우 (`src/pages/QuestionPage.tsx`)
  - 요구사항: FR-014, FR-015
  - design.md: §5, §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: `window.confirm()` 통과 시에만 삭제 진행, `question.status==='waiting'`일 때만
    수정/삭제 버튼 렌더링(답변완료 시 버튼 자체가 DOM에 없음, FR-015)

### 반응형·모션

- [X] T034 [P] 1024px/640px 반응형 규칙 적용 (세 페이지 전체)
  - 요구사항: SC-007, 헌법 원칙 X
  - design.md: §20
  - 파일: `src/pages/MainPage.css`, `src/pages/ListPage.css`, `src/pages/QuestionPage.css`, `src/components/*.css`
  - 검증: 1024px/640px `@media` 규칙이 design.md §20 브레이크포인트와 일치(코드 확인).
    실제 뷰포트 렌더링 확인은 T036 참조
- [X] T035 [P] prefers-reduced-motion 가드 적용 — Aurora/Float/Shimmer/Spinner
  - 요구사항: 헌법 원칙 VII
  - design.md: §22
  - 파일: `src/pages/MainPage.css`, `src/components/FloatingCards.css`, `src/components/StatePanel.css`, `src/pages/QuestionPage.css`
  - 검증: 4개 애니메이션 모두 `@media (prefers-reduced-motion: no-preference)` 안에서만
    선언되어 있음을 코드로 확인(design.md §22 표와 1:1 대응)
- [ ] T036 데스크톱 1440px/모바일 390px 수동 검증 (세 페이지)
  - 요구사항: SC-007
  - design.md: §20, §24
  - 파일: 없음(수동 검증)
  - 검증: 브라우저 devtools 뷰포트 프리셋으로 두 폭에서 핵심 시나리오 완결 확인
  - **미완료 사유**: 이 세션에서 Claude in Chrome 브라우저 확장이 연결되지 않아
    (`Browser extension is not connected`) 실제 렌더링을 눈으로 확인하지 못했다.
    `npm run build`/`lint`/`test`는 모두 통과했고 미디어쿼리 코드는 존재하지만, 이는
    "코드가 존재한다"는 것만 확인한 것이지 "실제로 의도대로 렌더링된다"는 것을 확인한
    것은 아니다. **사용자가 `npm run dev` 실행 후 1440px/390px에서 직접 확인 필요.**

**Checkpoint**: 세 화면이 Mock Data로 완전히 동작 — **Phase 4 진입 전 로컬 UI 수동 검증 필수**

---

## Phase 4: Claude Design 동기화와 UI 수정

**Purpose**: 승인된 Claude Design 프로젝트와 실제 구현을 맞춘다.

**Dependencies**: Phase 3 체크포인트(로컬 UI 검증) 완료 필수. **이 Phase 완료 전
Phase 5(Supabase)를 시작하지 않는다.**

- [ ] T037 `/design-sync` 실행 전 코드 구조 검사
  - 요구사항: 헌법 원칙 IV, XII
  - design.md: §3~§4
  - 파일: 없음(검사만)  
  - 검증: 컴포넌트/페이지 파일 구조가 design.md §3~4의 화면 구조와 1:1 대응하는지 체크리스트로 확인
- [ ] T038 `/design-sync` 실행 — 승인된 Claude Design과 비교
  - 요구사항: 없음(도구 실행)
  - design.md: 전체
  - 파일: 없음(도구 실행, 로그만 생성)
  - 검증: `/design-sync` 결과 로그에 CRITICAL/HIGH 항목 목록이 출력됨
- [ ] T039 CSS 커스텀 프로퍼티 ↔ design.md §15 토큰 동기화
  - 요구사항: 없음
  - design.md: §15
  - 파일: `src/styles/tokens.css`
  - 검증: 토큰 값이 Claude Design 최종본(`main.html`/`list.html`/`question.html`)과 동일
- [ ] T040 세 화면을 승인된 Claude Design 마크업/구조와 항목별 비교
  - 요구사항: 헌법 원칙 V
  - design.md: §4, §9~§13
  - 파일: `src/pages/*.tsx`
  - 검증: 레이아웃 순서·클래스 역할이 Claude Design 확정본과 일치
- [ ] T041 CRITICAL/HIGH 시각 문제 수정
  - 요구사항: 헌법 원칙 VI~IX (해당 시)
  - design.md: §23 (금지 패턴 참조)
  - 파일: `/design-sync`가 지목한 파일
  - 검증: 재검사 시 동일 CRITICAL/HIGH 항목이 재발생하지 않음
- [ ] T042 디자인 회귀 검증 — 재실행 또는 수동 diff
  - 요구사항: 헌법 원칙 XIII
  - design.md: §24 (구현 후 시각 검증 항목 전체)
  - 파일: 없음(검증만)
  - 검증: design.md §24 체크리스트 11개 항목 전부 확인 완료
- [ ] T043 design-sync 결과 기록
  - 요구사항: 헌법 원칙 XII(추적성)
  - design.md: 없음
  - 파일: `specs/001-qanow-qa-board/design-sync-log.md` (신규)
  - 검증: 발견된 문제·수정 내역·재검증 결과가 표로 기록됨

**Checkpoint**: 승인된 디자인과 구현이 일치 — **Supabase Phase 진입 가능**

---

## Phase 5: Supabase 기반

**Dependencies**: Phase 4 체크포인트 완료 필수.

- [ ] T044 [P] `@supabase/supabase-js` 설치 및 환경변수 설정
  - 요구사항: 없음(인프라)
  - design.md: 없음
  - 파일: `package.json`, `.env.local.example`
  - 검증: 환경변수 누락 시 빌드 실패로 즉시 감지
- [ ] T045 Supabase 클라이언트 초기화 (`src/lib/supabaseClient.ts`)
  - 요구사항: 없음(인프라)
  - design.md: 없음
  - 파일: `src/lib/supabaseClient.ts`
  - 검증: 클라이언트 초기화 후 헬스체크 쿼리 성공
- [ ] T046 [P] `profiles` 테이블 마이그레이션 (id, email, role)
  - 요구사항: Spec §Key Entities(회원/관리자)
  - design.md: 없음
  - 파일: `supabase/migrations/0001_profiles.sql`
  - 검증: 마이그레이션 적용 후 `role` 컬럼이 `member`/`admin` 값만 허용
- [ ] T047 [P] `questions` 테이블 마이그레이션 (id, title, content, author_id, status, created_at, updated_at)
  - 요구사항: Spec §Key Entities(질문), FR-009
  - design.md: 없음
  - 파일: `supabase/migrations/0002_questions.sql`
  - 검증: `status` 기본값이 "답변대기"로 삽입됨
- [ ] T048 [P] `answers` 테이블 마이그레이션 (id, question_id, content, admin_id, created_at, updated_at)
  - 요구사항: Spec §Key Entities(답변)
  - design.md: 없음
  - 파일: `supabase/migrations/0003_answers.sql`
  - 검증: `question_id` unique 제약으로 질문당 답변 1건만 허용
- [ ] T049 RLS 정책 — 회원은 본인 질문만 조회/수정/삭제하며, 답변완료 질문은 수정·삭제 불가
  - 요구사항: FR-010, FR-013, FR-014, FR-015, FR-021, 헌법 원칙 II
  - design.md: 없음
  - 파일: `supabase/migrations/0004_rls_questions_member.sql`
  - 세부: SELECT/UPDATE/DELETE 정책 모두 `author_id = auth.uid()` 조건을 포함하고,
    UPDATE·DELETE 정책에는 추가로 `status <> '답변완료'` 조건을 명시한다(FR-015).
    관리자가 답변을 등록해 상태가 변경된 이후에는 이 조건에 의해 소유자 본인의
    요청도 데이터 계층에서 거부되어야 한다.
  - 검증: (1) 타 회원 UID로 API 직접 호출 시 거부(SC-005), (2) 본인 소유이지만
    상태가 "답변완료"인 질문에 대한 UPDATE/DELETE 직접 API 호출이 거부됨(FR-015)
- [ ] T050 RLS 정책 — 관리자는 전체 질문 조회 + 답변 작성/수정만 가능
  - 요구사항: FR-011, FR-016, FR-019, 헌법 원칙 II
  - design.md: 없음
  - 파일: `supabase/migrations/0005_rls_questions_admin.sql`
  - 검증: admin 역할 토큰으로 전체 질문 SELECT 성공
- [ ] T051 RLS 정책 — 회원의 답변 작성/수정 차단
  - 요구사항: FR-020, 헌법 원칙 II
  - design.md: 없음
  - 파일: `supabase/migrations/0006_rls_answers_block_member.sql`
  - 검증: member 역할 토큰으로 answers INSERT/UPDATE 시도 시 거부됨
- [ ] T052 관리자 역할 판별 로직 (`src/lib/auth.ts`)
  - 요구사항: FR-003
  - design.md: §6
  - 파일: `src/lib/auth.ts`
  - 검증: `profiles.role` 조회 결과로 UI 분기가 결정됨
- [ ] T053 mockSession → 실제 Supabase 세션 교체 (`src/hooks/useAuth.ts`)
  - 요구사항: FR-002, FR-003
  - design.md: §6
  - 파일: `src/hooks/useAuth.ts`
  - 검증: `src/mocks/mockSession.ts` 참조가 프로덕션 경로에서 모두 제거됨

**Checkpoint**: 데이터 계층 준비 완료

---

## Phase 6: 회원 기능

**Dependencies**: Phase 5 완료.

- [ ] T054 [US1] 회원가입 구현 (Supabase Auth, 이메일+비밀번호)
  - 요구사항: FR-001
  - design.md: 없음(design-brief §9 흐름 참조)
  - 파일: `src/pages/MainPage.tsx` 또는 `src/components/SignupForm.tsx`
  - 검증: 이메일/비밀번호로 가입 후 `profiles` 행 자동 생성 확인
- [ ] T055 [US1] 로그인/로그아웃 연결 (Header)
  - 요구사항: FR-002
  - design.md: §7
  - 파일: `src/components/Header.tsx`
  - 검증: 로그인 후 이메일 chip 표시, 로그아웃 시 초기 상태로 복귀
- [ ] T056 [US3] LoginModal을 실제 Supabase 인증으로 교체
  - 요구사항: FR-005
  - design.md: §5
  - 파일: `src/components/LoginModal.tsx`
  - 검증: 잘못된 자격증명 시 오류 표시, 성공 시 `pendingRedirect`로 이동
- [ ] T057 [US1] "내 질문" 목록 조회 (`auth.uid()` 범위) (`src/pages/ListPage.tsx`)
  - 요구사항: FR-010
  - design.md: §11
  - 파일: `src/pages/ListPage.tsx`
  - 검증: 다른 계정으로 로그인 시 다른 목록이 반환됨
- [ ] T058 [US1] 질문 작성(insert) + 서버 검증 오류 표시
  - 요구사항: FR-006, FR-007, FR-008, FR-009
  - design.md: §12
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: 서버 측 길이 제약 위반 시 API 오류가 `.field-error`로 노출됨
- [ ] T059 [US4] 질문 수정(update) — 답변완료 시 차단 (UI는 T049의 RLS 조건을 신뢰하고,
  API 오류를 사용자 메시지로 매핑만 수행)
  - 요구사항: FR-013, FR-015
  - design.md: §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 의존: T049 (RLS의 `status <> '답변완료'` 조건이 실제 거부를 수행)
  - 검증: 답변 완료 후 수정 시도 시 T049의 RLS 거부 응답을 "이미 답변된 질문은
    수정할 수 없습니다" 오류로 표시(Spec Edge Cases)
- [ ] T060 [US4] 질문 삭제(delete) + 확인 + RLS 검증
  - 요구사항: FR-014, FR-015
  - design.md: §5, §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 의존: T049 (RLS의 `status <> '답변완료'` 조건이 실제 거부를 수행)
  - 검증: 삭제 후 목록에서 즉시 사라짐, 답변완료 질문 삭제 시도는 T049의 RLS
    정책에서 거부됨(UI 확인창 통과 여부와 무관하게 서버가 최종 차단)
- [ ] T061 [US1] 질문 상세에서 답변 조인 조회
  - 요구사항: FR-012
  - design.md: §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: 답변 등록 후 새로고침 없이(또는 새로고침 후) 상태가 "답변완료"로 반영
- [ ] T062 [US3] 타 회원 질문 직접 접근 시 Unauthorized 처리
  - 요구사항: FR-021
  - design.md: §14
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: 타인 질문 ID로 직접 URL 접근 시 콘텐츠 노출 없이 unauthorized 상태만 표시(SC-005)
- [ ] T063 [US3] 비회원의 보호된 라우트 접근 가드
  - 요구사항: FR-022
  - design.md: §5
  - 파일: `src/App.tsx` 또는 라우터 가드
  - 검증: 비로그인 상태로 `/list`, `/question` 직접 접근 시 LoginModal 또는 로그인 안내로 전환

**Checkpoint**: US1·US3·US4 실제 백엔드로 종단 동작

---

## Phase 7: 관리자 기능

**Dependencies**: Phase 5 완료(Phase 6과 병렬 가능).

- [ ] T064 [US2] "문의 관리" 전체 목록 조회(작성자 포함) (`src/pages/ListPage.tsx`)
  - 요구사항: FR-011
  - design.md: §11
  - 파일: `src/pages/ListPage.tsx`
  - 검증: admin 계정 로그인 시 모든 회원의 질문 + 작성자 이메일이 표시
- [ ] T065 [US2] 관리자 답변 작성(insert, status→답변완료)
  - 요구사항: FR-016, FR-017, FR-018
  - design.md: §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: 답변 저장 후 질문 상태가 즉시 "답변완료"로 전환
- [ ] T066 [US2] 관리자 답변 수정(update)
  - 요구사항: FR-019
  - design.md: §13
  - 파일: `src/pages/QuestionPage.tsx`
  - 검증: 기존 답변 내용 수정 후 상세 화면에 변경 사항 반영
- [ ] T067 [US2] 회원의 답변 작성/수정 시도 서버측 차단 재검증
  - 요구사항: FR-020, 헌법 원칙 II
  - design.md: 없음
  - 파일: `supabase/migrations/0006_rls_answers_block_member.sql`(재검증)
  - 검증: member 토큰으로 answers 테이블 직접 API 호출 시 거부됨(우회 시도 포함)
- [ ] T068 [US2] 관리자 전용 UI 라우트 가드
  - 요구사항: FR-011, FR-020
  - design.md: §6
  - 파일: `src/App.tsx` 또는 라우터 가드
  - 검증: member 계정으로 관리자 전용 답변 작성 UI 접근 시 노출되지 않음

**Checkpoint**: US2 실제 백엔드로 종단 동작 — 전체 핵심 왕복 흐름(US1+US2) 완결

---

## Phase 8: 테스트와 최종 검증

**Dependencies**: Phase 6, Phase 7 완료.

- [ ] T069 [P] 입력 유효성 단위 테스트 (`tests/unit/validation.test.ts`)
  - 요구사항: FR-007, FR-008, FR-017
  - design.md: 없음
  - 파일: `tests/unit/validation.test.ts`
  - 검증: 길이 초과·공백만 입력 케이스가 모두 실패로 검증됨
- [ ] T070 [P] 통합 테스트 — 회원 질문 등록 → 답변대기 표시 (`tests/integration/us1-create.test.ts`)
  - 요구사항: US1 Acceptance Scenario 1
  - design.md: §11~§12
  - 파일: `tests/integration/us1-create.test.ts`
  - 검증: 시나리오 1 Given-When-Then 전체 통과
- [ ] T071 [P] 통합 테스트 — 관리자 답변 → 답변완료 전환 (`tests/integration/us2-answer.test.ts`)
  - 요구사항: US2 Acceptance Scenario 2
  - design.md: §13
  - 파일: `tests/integration/us2-answer.test.ts`
  - 검증: 시나리오 2 Given-When-Then 전체 통과
- [ ] T072 [P] 통합 테스트 — 타 회원 질문 무단 접근 차단 (`tests/integration/authz.test.ts`)
  - 요구사항: FR-021, SC-005
  - design.md: §14
  - 파일: `tests/integration/authz.test.ts`
  - 검증: UI 우회(직접 API 호출) 시에도 100% 차단
- [ ] T073 [P] 통합 테스트 — 비회원 보호 화면 접근 시 로그인 안내 (`tests/integration/guest-guard.test.ts`)
  - 요구사항: FR-022
  - design.md: §5
  - 파일: `tests/integration/guest-guard.test.ts`
  - 검증: 세 보호 화면(작성/리스트/상세) 모두에서 로그인 안내로 전환
- [ ] T074 키보드 전용 흐름 수동 점검 — 질문 작성/답변 작성
  - 요구사항: 헌법 원칙 VIII
  - design.md: §21, §24
  - 파일: 없음(수동 검증)
  - 검증: Tab만으로 두 흐름을 모두 완료
- [ ] T075 prefers-reduced-motion 브라우저 에뮬레이션 점검
  - 요구사항: 헌법 원칙 VII
  - design.md: §22, §24
  - 파일: 없음(수동 검증)
  - 검증: devtools에서 reduced-motion 활성화 시 4개 애니메이션 모두 정지 상태
- [ ] T076 데스크톱/모바일 종단 시나리오 재검증 — SC-002, SC-003, SC-007
  - 요구사항: SC-002, SC-003, SC-007
  - design.md: §20
  - 파일: 없음(수동 검증)
  - 검증: 1440px/390px 각각에서 회원가입→질문등록(5분 이내), 답변대기→답변등록(3분 이내) 완료
- [ ] T077 `checklists/plan-design-readiness.md` 및 `checklists/requirements.md` 잔여 항목 해소
  - 요구사항: 헌법 원칙 XII
  - design.md: 전체
  - 파일: `specs/001-qanow-qa-board/checklists/*.md`
  - 검증: 두 체크리스트의 미해결 `[Gap]` 항목이 모두 해소되어 리뷰어가 `[x]` 처리 가능
- [ ] T078 최종 lint + test + build 게이트
  - 요구사항: 헌법 원칙 XIII
  - design.md: 없음
  - 파일: 전체 프로젝트
  - 검증: `npm run lint && npm run test && npm run build` 모두 종료 코드 0

**Checkpoint**: 전체 기능 완료 및 검증

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1(설정)**: 선행 의존성 없음 — 즉시 시작
- **Phase 2(디자인 시스템)**: Phase 1 완료 후 시작, **Phase 3 전체를 블로킹**
- **Phase 3(세 화면+Mock)**: Phase 2 완료 후 시작. 완료 시 **로컬 UI 수동 검증(T036) 후에만 Phase 4 진입**
- **Phase 4(design-sync)**: Phase 3 체크포인트 완료 후 시작. **완료 전 Phase 5(Supabase) 착수 금지** — 사용자 명시 요구사항
- **Phase 5(Supabase)**: Phase 4 체크포인트(T043) 완료 후에만 시작
- **Phase 6(회원 기능)/Phase 7(관리자 기능)**: Phase 5 완료 후 시작, 서로 병렬 가능
- **Phase 8(테스트/최종검증)**: Phase 6, 7 모두 완료 후 시작

```
Phase1 → Phase2 → Phase3 → [체크포인트: 로컬 UI 검증]
                              → Phase4 → [체크포인트: design-sync 통과]
                                          → Phase5 → { Phase6 ∥ Phase7 } → Phase8
```

### Story Dependencies

- **US1(P1)**: Phase3(Mock)에서 UI 우선 구현 → Phase6에서 실제 백엔드 연결
- **US2(P1)**: Phase3(Mock)에서 UI 우선 구현 → Phase7에서 실제 백엔드 연결
- **US3(P2)**: Phase3(LoginModal, Mock) → Phase6(T056, T063)에서 실제 인증 연결
- **US4(P3)**: Phase3(수정/삭제 UI, Mock) → Phase6(T059, T060)에서 실제 백엔드 연결

### Parallel Opportunities

- Phase 1: T002, T003, T004
- Phase 2: T006~T013 (컴포넌트별 파일 분리)
- Phase 3: T015~T017(Mock 선행), T034, T035(반응형/모션은 페이지 완성 후 병렬)
- Phase 5: T044, T046, T047, T048(테이블별 마이그레이션)
- Phase 6 ∥ Phase 7: 서로 다른 담당자가 동시 진행 가능
- Phase 8: T069~T073(테스트 파일별 병렬)

---

## Parallel Example: Phase 2

```bash
Task: "CSS 디자인 토큰 정의 in src/styles/tokens.css"
Task: "전역 리셋/기본 스타일 in src/styles/global.css"
Task: "타이포그래피 스타일 in src/styles/typography.css"
Task: "Button 컴포넌트 in src/components/Button.tsx"
Task: "Input/Textarea 컴포넌트 in src/components/Input.tsx, src/components/Textarea.tsx"
Task: "Badge 컴포넌트 in src/components/Badge.tsx"
Task: "StatePanel 컴포넌트 in src/components/StatePanel.tsx"
```

---

## Implementation Strategy

### Mock-First (Phase 1~4)

1. Phase 1~2: 인프라 + 디자인 시스템
2. Phase 3: Mock Data/Session으로 세 화면 완성 → **로컬에서 수동 검증**
3. Phase 4: `/design-sync`로 승인된 Claude Design과 대조, CRITICAL/HIGH 수정
4. **STOP and VALIDATE**: design.md §24 체크리스트 전체 통과 확인 후에만 다음 단계 진행

### Backend Integration (Phase 5~8)

5. Phase 5: Supabase 스키마 + RLS — 데이터 계층에서 권한을 최종 강제(헌법 원칙 II)
6. Phase 6 ∥ Phase 7: 회원/관리자 기능을 Mock에서 실제 데이터로 교체
7. Phase 8: 통합 테스트 + 접근성/반응형 수동 검증 + 최종 빌드 게이트

---

## Notes

- Phase 3→4, Phase 4→5 사이의 체크포인트는 **강제 게이트**다: 이전 Phase의 체크포인트
  조건이 충족되지 않으면 다음 Phase의 Task를 시작하지 않는다(사용자 명시 요구사항).
- 모든 RLS 관련 Task(T049~T051, T067)는 헌법 원칙 II(데이터 계층 최종 강제)의 직접
  구현이며, UI 단의 조건 분기만으로 대체할 수 없다.
- `[P]` Task는 서로 다른 파일을 다루며 선행 미완료 Task에 의존하지 않는다.
- Task 완료 후 각 Task 하위의 "검증" 항목을 통과해야 다음 Task로 넘어간다.
- plan.md가 아직 없으므로, `/speckit-plan` 실행 후에는 이 tasks.md가 plan.md와
  충돌하지 않는지 재검토가 필요하다.

---

## Phase 9: Convergence

**Purpose**: `/speckit-converge`가 spec.md/design.md/constitution.md 대비 코드베이스를
재검토해 기존 Task로 추적되지 않던 잔여 작업을 발견해 추가함(2026-08-26).

- [ ] T079 Supabase `questions`/`answers` 테이블에 제목(1~100자)·내용(1~5000자)·답변(1~5000자)
  공백 제거 후 길이 검증을 DB `CHECK` 제약으로 강제 per FR-007, FR-008, FR-017, 헌법 III (missing)
  - 요구사항: FR-007, FR-008, FR-017, 헌법 원칙 III(서버 측 입력 검증 필수)
  - design.md: 없음
  - 파일: `supabase/migrations/0002_questions.sql`, `supabase/migrations/0003_answers.sql`
    (T047/T048에 제약 추가로 병합 가능)
  - 검증: 공백만 입력하거나 길이를 초과한 값으로 직접 API INSERT/UPDATE 시도 시 DB가 거부
- [ ] T080 저장 액션 중 세션 만료가 감지되면 저장을 거부하고 로그인 안내로 전환하는 처리
  추가 per Spec §Edge Cases("로그인 세션이 만료된 상태에서 회원이 저장을 시도하면") (missing)
  - 요구사항: Spec §Edge Cases, FR-022
  - design.md: §5
  - 파일: `src/pages/QuestionPage.tsx`, `src/hooks/useAuth.ts`(Phase 6에서 신설 예정)
  - 검증: 저장 API가 인증 오류(401 등)를 반환하면 저장이 취소되고 로그인 모달/안내로 전환됨을
    확인(Mock 단계에서는 세션 만료를 시뮬레이션할 방법이 없으므로 Phase 6 실제 인증 연동
    시점에 함께 구현)
- [ ] T081 회원이 질문을 수정하는 도중 관리자가 먼저 답변을 등록하는 동시성 시나리오에
  대한 통합 테스트 추가 per Spec §Edge Cases("회원이 질문을 수정하는 사이 관리자가 먼저
  답변을 등록하면") (missing)
  - 요구사항: Spec §Edge Cases, FR-015
  - design.md: 없음
  - 파일: `tests/integration/edit-answer-race.test.ts`
  - 검증: 회원이 수정 화면을 연 상태에서 관리자가 먼저 답변을 등록한 뒤 회원이 저장을
    시도하면 T049의 RLS 조건에 의해 저장이 거부되고 "이미 답변된 질문은 수정할 수
    없습니다" 오류가 표시됨을 자동 테스트로 검증
