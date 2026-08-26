# QANOW 디자인 명세 (design.md)

**Status**: Approved (Claude Design 프로젝트 기준 확정)
**Source of truth**: Claude Design 프로젝트 `6ca3de96-84d6-44d0-95cf-77730f2e228b`
  — `main.html`, `list.html`, `question.html` (CRITICAL/HIGH 수정 반영 최종본)
**Reference docs**: [spec.md](./spec.md), [design-brief.md](./design-brief.md), [constitution.md](../../.specify/memory/constitution.md)
**Created**: 2026-08-21

이 문서는 Claude Design에서 확정된 세 화면의 실제 마크업·CSS·상호작용을 그대로
문서화한 것이다. 디자인을 재해석하지 않으며, React/CSS 구현 시 이 문서를 1차
기준으로 삼는다.

---

## 1. 디자인 콘셉트와 목표

**콘셉트**: "Bright Editorial 기반 + Dark Aurora Hero" — 시안 비교(A/B) 이후 회원·관리자가
사용하는 내부 화면(질문 리스트/질문 페이지)은 가독성 우선의 밝은 화면으로, 비회원이
가장 먼저 만나는 메인 페이지만 강한 시각적 인상(다크 Aurora Hero)을 유지하는 하이브리드
방향으로 확정되었다.

**목표** (design-brief.md §2 대응):
- 신뢰감과 정보성 — 메인 Hero에서 서비스 성격을 즉시 전달 (SC-001)
- 효율성 — 리스트/질문 페이지는 장식보다 정보 탐색 속도 우선
- 명확한 상태 표시 — 답변 대기/완료를 색상+텍스트로 항상 병기 (FR-023, 헌법 IX)
- 모바일 우선 — 모든 핵심 시나리오가 390px 폭에서 완결 (SC-007, 헌법 X)
- 접근성 — WCAG 2.2 AA 대비, 키보드 포커스, reduced-motion 대응 (헌법 VII·VIII·IX)

---

## 2. 브랜드 이름과 핵심 문구

- **서비스명**: QANOW
- **메인 카피**: "질문은 빠르게, 답변은 명확하게."
- **서브 카피**: "궁금한 점을 남기면 관리자가 확인하고 답변해드립니다."
- **Primary CTA**: "질문 작성하기"
- **Secondary CTA**: "내 질문 확인하기"
- **이용 흐름 3단계**: "질문 작성" → "관리자 확인" → "답변 확인" (FR-004)
- **상태 배지 텍스트**: "답변 대기 중" / "답변 완료" (FR-009, FR-018)

---

## 3. 세 핵심 화면의 정보 구조

| 화면 | 파일 | 목적 | 관련 요구사항 |
|---|---|---|---|
| 메인 페이지 | `main.html` | 서비스 소개, 이용 흐름 안내, 질문 작성 진입 | FR-004, FR-005 |
| 질문 리스트 | `list.html` | 역할별 질문 목록 조회·필터링 | FR-010, FR-011 |
| 질문 페이지 | `question.html` | 작성·상세·수정·답변 작성/수정 단일 인터페이스 | FR-006, FR-012, FR-013, FR-016, FR-019 |

세 화면은 동일한 Header(56px/48px), 버튼(`.btn` 계열), 배지(`.badge` 계열) 컴포넌트
클래스를 공유한다 (헌법 V: Cross-Screen Consistency).

---

## 4. 화면별 레이아웃

### 메인 페이지 (`main.html`)
1. Header (56px, 흰 배경)
2. Hero (다크 Aurora, `min-height:80vh`) — 좌측 텍스트+CTA, 우측 플로팅 질문/답변 카드
3. 이용 흐름 섹션 (밝은 배경, 3열→1열)
4. 상태 배지 소개 섹션 (흰 배경)
5. Footer

### 질문 리스트 (`list.html`)
1. Header (공통)
2. Page Head — 제목("내 질문"/"문의 관리") + "새 질문 작성" 버튼
3. 필터 탭 (모두/답변 대기/답변 완료)
4. 리스트 본문 (기본/로딩/빈 목록/오류 중 하나)

### 질문 페이지 (`question.html`)
1. Header (공통)
2. Breadcrumb ("← 목록으로 돌아가기")
3. 콘텐츠 영역 (`.narrow`, max-width 760px) — 상태에 따라 새 작성/상세/수정/답변작성/
   답변수정/권한없음/로딩/오류/저장중 중 하나만 표시

---

## 5. 화면 간 이동

```
main.html
├─ Header "로그인" 클릭 → 로그인 모달 (성공 시 list.html?role=member)
├─ Hero "질문 작성하기" 클릭 → 로그인 모달 (성공 시 question.html?state=new)
├─ Hero "내 질문 확인하기" 클릭 → 로그인 모달 (성공 시 list.html?role=member)
└─ 로고 클릭 → main.html

list.html
├─ 필터 탭 클릭 → 같은 페이지 내 목록 필터링 (data-status 기반)
├─ 질문 행 클릭 → question.html?state=detail-*
├─ "+ 새 질문 작성" → question.html?state=new
└─ 로고 클릭 → main.html

question.html (작성)
├─ "저장" → list.html
└─ "취소" → list.html

question.html (상세 — 회원, 답변 전)
├─ "수정" → question.html?state=edit
└─ "삭제" → confirm() 확인 후 list.html

question.html (수정)
├─ "저장" → question.html?state=detail-member-pending
└─ "취소" → question.html?state=detail-member-pending

question.html (상세 — 관리자)
├─ "답변 저장" → 저장중 오버레이 → list.html?role=admin
└─ "취소" → list.html?role=admin

모든 화면
└─ "목록으로 돌아가기" / breadcrumb → list.html
```

로그인 모달은 FR-005("모달/팝업 형태의 로그인 폼을 표시하고 질문 작성 화면 진입을
막아야 한다")를 구현하며, main.html에 `role="dialog" aria-modal="true"`로 존재한다.
이 모달에는 이메일·비밀번호 입력과 "로그인"/"취소" 버튼만 있으며, 내부에 별도의
회원가입 링크를 두지 않는다(design-brief.md §9의 "로그인 모달 └─ 회원가입 링크 →
MVP 제외" 흐름을 그대로 반영 — 회원가입은 헤더의 별도 "회원가입" 버튼(§7)으로만
진입한다).

**비회원의 보호된 화면 직접 접근 (FR-022)**: main.html의 CTA는 클릭 시 로그인
모달을 띄우지만, 비회원이 `list.html`이나 `question.html` URL에 직접 접근하는
경우는 모달을 새로 열 수 없는 별도 화면이므로 다음과 같이 처리한다 — 두 화면
모두 인증 상태를 확인하는 즉시(마운트 시) 비회원이면 main.html로 리다이렉트하고,
main.html 도착과 동시에 로그인 모달을 자동으로 연다(리다이렉트 대상은
`pendingRedirect`로 원래 요청 경로를 유지). 즉, "직접 URL 접근"과 "CTA 클릭"은
최종적으로 동일한 로그인 모달 컴포넌트로 수렴하며, 화면별로 다른 안내 문구를
새로 만들지 않는다.

---

## 6. 회원과 관리자 상태 차이

| 구분 | 회원 | 관리자 |
|---|---|---|
| 리스트 제목 | "내 질문" | "문의 관리" |
| 리스트 범위 | 본인 질문만 (FR-010) | 전체 회원 질문 (FR-011) |
| 리스트 작성자 표시 | 숨김 (`.admin-only-meta { display:none }`) | 표시 |
| 빈 목록 문구 | "아직 질문이 없습니다" + "질문 작성하기" CTA | "답변 대기 중인 질문이 없습니다" + "필터 변경" CTA (FR-024) |
| 상세 — 답변 전 | 수정/삭제 버튼 표시 (FR-013, FR-014) | 답변 작성 폼 표시 (FR-016) |
| 상세 — 답변 후 | 수정/삭제 버튼 없음 (FR-015) | 답변 수정 폼 표시 (FR-019) |
| Header 표시 | `member@qanow.io` | `admin@qanow.io` + 보라색 "관리자" 역할 태그 |

`list.html`/`question.html`은 역할 전환에 따라 `applyRole()`/`applyState()` 스크립트로
제목·문구·메타 표시를 갱신한다 (Claude Design 프로토타입에서는 데모 전환 UI로 구현,
실제 구현에서는 로그인 세션의 역할 값으로 대체).

**Mock 단계와 헌법 원칙 II의 관계**: Phase 3~4(Mock Data 기반 UI 구현)에서는 위
역할 전환이 URL 파라미터/데모 스위처로 시뮬레이션되며, 이 시점에는 실제 서버측
권한 강제가 아직 존재하지 않는다. 이는 헌법 원칙 II(데이터 계층 최종 강제)의
예외가 아니라, 아직 데이터 계층(Supabase RLS, Phase 5)이 구축되지 않은 **개발
중간 단계**일 뿐이다. 따라서 이 Mock 상태의 애플리케이션은 배포·공개 대상이
아니며, Phase 5의 RLS 정책이 적용되기 전까지는 "구현 완료"로 간주하지 않는다
(tasks.md Phase 3→4→5 게이트 참조).

---

## 7. Header와 Navigation 규칙

- 높이: 데스크톱 56px, 모바일(≤640px) 48px
- 배경: 흰색(`--white`), 하단 1px 보더(`--gray-200`), `position: sticky; top:0`
- 좌측: 로고 "QANOW" (1.25rem, 700, `--navy`), 클릭 시 항상 `main.html`
- 우측:
  - 비로그인(main.html): "로그인"(Secondary, 로그인 모달 연결) / "회원가입"(Primary,
    FR-001 이메일+비밀번호 회원가입 화면으로 연결 — 헤더의 이 버튼은 FR-001 범위
    안이며 MVP 제외 대상이 아니다)
  - 로그인 상태(list.html/question.html): 사용자 이메일 chip + "로그아웃" 버튼, 관리자는
    이메일 옆 role-tag("관리자") 추가 표시
- 내부 컨테이너는 페이지 콘텐츠와 동일한 `max-width:1200px` 정렬을 공유

---

## 8. Page Header 규칙

- 페이지 제목: H2 스타일(2rem, 600, `--navy`), 역할에 따라 텍스트 교체(§6)
- 부제: 0.9375rem, `--gray-500`
- 주요 액션 버튼(예: "새 질문 작성")은 제목과 같은 행 우측에 배치, 좁은 화면에서는
  `flex-wrap`으로 아래 줄바꿈
- 질문 상세 페이지의 제목(`.q-title`)은 1.5rem/600이며, 상태 배지·작성자·작성일이
  제목 바로 아래 한 줄(`.q-meta`)에 표시

---

## 9. 메인 Hero 구조

```
.hero (min-height:80vh, Aurora gradient 배경)
 └─ .container.hero-grid (flex, 좌우 배치 / 1024px 이하 세로 스택)
     ├─ .hero-content
     │   ├─ .service-name  "QANOW"
     │   ├─ .hero-main     "질문은 빠르게,<br>답변은 명확하게."
     │   ├─ .hero-sub      보조 설명
     │   └─ .hero-cta      Primary + Secondary 버튼
     └─ .floating-cards (질문 카드 + 답변 카드 + 연결선, 1024px 이하 세로 스택·연결선 숨김)
```

Hero 다음에는 "이용 흐름"(3단계, 밝은 배경)과 "상태 배지 소개" 섹션이 이어지며, 배경이
다크 Hero → Light Surface(`--bg:#f9fafb`)로 자연스럽게 전환된다 (design-brief §13 Hero
80vh 규정 반영).

---

## 10. Aurora Gradient, Grid Glow, Floating Card 효과

- **Aurora Gradient**: `linear-gradient(135deg, --navy 0%, --blue 55%, --violet 100%)`,
  `prefers-reduced-motion: no-preference`일 때만 `background-size:200% 200%`와
  6초 `aurora` keyframe 애니메이션 적용. reduced-motion 사용자는 정적 그라데이션만 본다.
- **Grid Glow**: `.hero::before`에 60px×60px 격자 패턴을 `rgba(255,255,255,0.05)`로
  오버레이 (움직이지 않는 정적 장식, 애니메이션 대상 아님).
- **Floating Card**: 질문 카드(`.fcard-q`)와 답변 카드(`.fcard-a`)가 세로로 살짝
  어긋나게 배치되고 그라데이션 연결선(`.connector`)으로 이어진다.
  `prefers-reduced-motion: no-preference`일 때만 각각 4초 주기 `float1` 애니메이션(±10px
  상하 이동)이 적용되며, reduced-motion 사용자는 카드가 고정된 채로 보인다.
  1024px 이하에서는 두 카드가 나란한 정적 레이아웃으로 전환되고 애니메이션과 연결선은
  제거된다(헌법 VI: 시각 효과가 콘텐츠 판독을 방해하지 않음). **구현 기법**: 이 전환은
  별도의 컴포넌트 분기(JS 조건부 렌더링)가 아니라 순수 CSS 미디어쿼리(`@media
  (max-width:1024px)`)로만 구현한다 — `FloatingCards` 컴포넌트는 항상 동일한 마크업을
  렌더링하고, `.connector` 숨김과 `.fcard` 위치 재배치는 CSS 클래스 규칙 변경만으로
  처리한다(JS 상태나 리렌더링 불필요).

---

## 11. 질문 리스트 카드(행) 구조

```
a.q-row (전체가 클릭 가능한 링크, question.html?state=... 로 이동)
 ├─ .q-main
 │   ├─ .q-title  (한 줄 ellipsis, 640px 이하에서는 줄바꿈 허용)
 │   └─ .q-meta   (관리자만 작성자 이메일 표시 + 작성일)
 └─ .badge (badge-waiting | badge-done)
```

- 데스크톱: `flex-direction:row`, 제목/메타 좌측, 배지 우측
- 모바일(≤640px): `flex-direction:column; align-items:flex-start` — 배지가 제목 아래로
  이동, 표 형태 대신 카드 형태 유지 (design-brief §6: "모바일에서는 표보다 카드 형태를
  우선")
- hover 시 보더 색상만 `--blue`로 강조(장식적 보조 신호일 뿐, 클릭 가능 여부는 hover
  없이도 카드 전체가 링크이므로 모바일에서 동일하게 동작)

---

## 12. 질문 작성 폼 구조

```
.q-header  → "새 질문 작성" (H1 스타일)
.field × 2
 ├─ .field-label (라벨 + 우측 글자 수 힌트 "0/100" / "0/5000")
 ├─ input.field-input | textarea.field-textarea
 └─ .field-error (기본 숨김, .field.invalid 상태에서만 표시)
.form-actions → "저장"(Primary) / "취소"(Secondary)
```

- 제목 필드: `input`, 높이 44px, placeholder "질문을 간결하게 입력하세요" (FR-007: 1~100자)
- 내용 필드: `textarea`, `min-height:220px`, placeholder "궁금한 점을 자세히 설명해주세요"
  (FR-008: 1~5000자)
- 유효성 오류 시 `.field-error`가 빨간 텍스트로 표시되고 입력 테두리가 `--red`로 전환
- 모바일(≤640px)에서 `.form-actions` 버튼은 `flex:1`로 전체 폭을 채움

동일한 `.field` 구조가 질문 수정(edit)과 관리자 답변 작성/수정 폼에도 재사용된다
(헌법 V: 컴포넌트 재사용).

---

## 13. 질문 상세와 답변 영역 구조

```
.q-header
 ├─ .q-title-row (제목 + 회원 전용 수정/삭제 버튼)
 └─ .q-meta (배지 + 작성자 이메일 + 작성일)
.q-body (max-width:70ch, line-height:1.7, white-space:pre-wrap)
.answer-block (상단 2px 보더로 질문 영역과 명확히 분리)
 ├─ 답변 대기 중: .waiting-note (호박색 안내 배너, "아직 답변이 등록되지 않았습니다")
 ├─ 답변 완료(회원 뷰): .answer-card (흰 카드, 답변 본문 + 작성 관리자/시각)
 └─ 관리자 뷰: .field(답변 textarea) + .form-actions("답변 저장"/"취소")
```

- 질문/답변 본문은 항상 `max-width:70ch`로 제한해 데스크톱에서도 한 줄이 과도하게
  길어지지 않도록 함 (design-brief §12: 데스크톱 65~75자 줄 길이 기준)
- 회원 뷰의 수정/삭제 버튼은 답변 완료 시 DOM에서 제거되어 노출되지 않음 (FR-015)
- 관리자 답변 저장은 클릭 시 저장중 오버레이(§14)를 거쳐 리스트로 이동

---

## 14. Loading, Empty, Error, Unauthorized 상태

공통 `.state-panel` 컴포넌트(아이콘 + 제목 + 설명 + 액션 버튼, 흰 배경/보더/모서리 8px)를
세 화면이 공유한다.

| 상태 | 화면 | 표시 내용 |
|---|---|---|
| Loading | list.html, question.html | 스켈레톤 바(`.skeleton`/`.skel-bar`), shimmer 애니메이션은 reduced-motion 시 비활성 |
| Empty | list.html | 📝 아이콘 + 역할별 문구(§6) + CTA (FR-024) |
| Error | list.html, question.html | ⚠️ 아이콘 + "문제가 발생했습니다" + "다시 시도"/"목록으로" 버튼 |
| Unauthorized | question.html | 🔒 아이콘 + "이 질문에 접근할 권한이 없습니다." + "목록으로 돌아가기" (FR-021) |
| Saving | question.html | 폼 비활성화(`disabled`) + 화면 중앙 오버레이 스피너 "저장 중입니다…" |

이 다섯 상태는 FR-023("로딩, 빈 목록, 오류, 권한 없음, 저장 중 상태를 명확히 구분")의
직접 구현이다.

---

## 15. 디자인 토큰

```css
--navy:#1a2840;   --blue:#2563eb;   --violet:#7c3aed;
--bg:#f9fafb;     --white:#ffffff;
--amber:#f59e0b;  --emerald:#10b981;   /* 장식용(예: proto-bar), 배지에는 미사용 */
--badge-waiting:#b45309;  --badge-done:#047857;  /* 배지 전용, WCAG AA 대비 확보 */
--red:#ef4444;
--gray-700:#374151; --gray-500:#6b7280; --gray-400:#9ca3af;
--gray-200:#e5e7eb; --gray-100:#f3f4f6;
```

`--amber`/`--emerald` 원색은 배지의 흰 텍스트 대비가 WCAG AA(4.5:1) 기준에 미달하여,
배지 전용 토큰 `--badge-waiting`/`--badge-done`으로 분리했다. 다른 장식 요소(대기 안내
배너 테두리 등)는 원색을 계속 사용한다.

---

## 16. 타이포그래피 계층

design-brief.md §12과 동일한 계층을 사용하며, Claude Design 확정본에서 실제 적용된
값은 다음과 같다.

| 용도 | 클래스 | 크기 | 굵기 |
|---|---|---|---|
| 메인 Hero 서비스명 | `.service-name` | 2.5rem (≤1024px: 2rem, ≤640px: 1.75rem) | 700 |
| Hero 메인 카피 | `.hero-main` | 2rem (≤1024px: 1.5rem, ≤640px: 1.375rem) | 600 |
| 섹션 제목 / 페이지 제목 | `.section-title` / `.page-title` | 2rem | 600 |
| 질문 상세 제목 | `.q-title` | 1.5rem | 600 |
| 리스트 질문 제목 | `.q-title`(list) | 1.25rem | 500 |
| 본문 | `.q-body` | 1rem, line-height 1.7 | 400 |
| 캡션/메타 | `.q-meta`, `.field-hint` | 0.875rem / 0.8125rem | 400~600 |

캡션 텍스트 색상은 항상 `--gray-500`을 사용한다(`--gray-400`은 흰 배경 대비 부족으로
텍스트에 사용하지 않음, §15 근거와 동일).

---

## 17. 색상 역할

| 역할 | 토큰 | 사용처 |
|---|---|---|
| Primary 강조 | `--blue` | Primary 버튼, 링크, 활성 필터 탭, 포커스 아웃라인 |
| 브랜드 텍스트 | `--navy` | 로고, 제목, Hero 서비스명 배경 그라데이션 시작색 |
| 보조 강조 | `--violet` | Hero 그라데이션 끝색, 관리자 role-tag |
| 배경(내부 페이지) | `--bg` | list.html/question.html 페이지 배경 |
| 카드/입력 배경 | `--white` | 카드, 입력 필드, 모달 |
| 답변 대기 | `--badge-waiting` (#b45309) | 배지 배경 |
| 답변 완료 | `--badge-done` (#047857) | 배지 배경 |
| 위험 | `--red` | 삭제 버튼, 유효성 오류 텍스트/테두리 |
| 보조 텍스트 | `--gray-500` | 캡션, 메타, 부제 |
| 구분선 | `--gray-200` | 보더, 구분선 |

---

## 18. 간격과 최대 콘텐츠 폭

- 콘텐츠 컨테이너: `max-width:1200px; margin:0 auto`
- 질문 페이지 콘텐츠: `.narrow { max-width:760px }` (가독성 우선, §13 근거)
- 좌우 패딩: 데스크톱 48px → 태블릿(≤1024px) 32px → 모바일(≤640px) 24px
- 카드/행 간 간격: 12px (`.list { gap:12px }`)
- 필드 간 간격: 20px (`.field { margin-bottom:20px }`)
- 섹션 간 간격(메인): 64px (`.section { padding:64px 0 }`)

---

## 19. 버튼·입력창·카드·배지 규칙

- **버튼**: 높이 44px(`.btn-sm`은 36px, 보조적 위치에서만 사용), 좌우 패딩 24px,
  모서리 6px, `border:none`
  - Primary: `--blue` 배경, 흰 텍스트
  - Secondary: 투명/흰 배경, `--navy` 텍스트, 1px `--gray-200` 테두리
  - Danger: `--red` 배경, 흰 텍스트 (삭제 전용)
  - disabled: `--gray-200` 배경 + `--gray-500`(≥AA 대비) 텍스트, `cursor:not-allowed`
- **입력창**: 높이 44px(textarea는 `min-height:220px`), 1px `--gray-200` 테두리,
  모서리 6px, 포커스 시 2px `--blue` 아웃라인 + 테두리색 전환
- **카드**: 모서리 8px, 1px `--gray-200` 테두리, 그림자는 메인 Hero의 플로팅 카드에만
  제한적으로 사용(`0 8px 24px rgba(0,0,0,0.18)`) — 내부 페이지 카드는 그림자 없음
  (과도한 그림자 금지 규칙, §23)
- **배지**: 모서리 4px, 좌우 패딩 12px, 흰 텍스트 + 아이콘(⏳/✓) + 텍스트 병기, 배경은
  §15의 배지 전용 토큰만 사용

---

## 20. 데스크톱과 모바일 반응형 규칙

- 브레이크포인트: 1024px(태블릿), 640px(모바일) — design-brief §13과 동일
- 검증 기준 폭: 데스크톱 1440px, 모바일 390px (컨테이너는 1440px 뷰포트 안에서
  1200px로 중앙 정렬됨)
- Hero: 1024px 이하에서 좌우 배치 → 세로 스택, 플로팅 카드는 나란한 정적 카드로 전환
- 질문 리스트 행: 640px 이하에서 세로 스택(§11)
- 폼 액션 버튼: 640px 이하에서 전체 폭(`flex:1`)
- 모든 핵심 시나리오(질문 등록, 답변 확인, 답변 작성)는 두 브레이크포인트 모두에서
  완결되어야 한다 (SC-007, 헌법 X)

---

## 21. 키보드 포커스와 접근성

- 전역 규칙: `a:focus-visible, button:focus-visible, input:focus-visible,
  textarea:focus-visible, select:focus-visible { outline:2px solid var(--blue);
  outline-offset:2px }`
- 입력 필드는 추가로 `:focus`에서 테두리색이 `--blue`로 전환되어 이중으로 확인 가능
- 질문 리스트 행(`.q-row`)은 앵커 요소이므로 Tab 이동 및 Enter 실행이 기본 지원됨
- 로그인 모달은 열릴 때 첫 입력 필드로 포커스 이동, `Escape` 키 및 오버레이 클릭으로
  닫힘 (완전한 focus trap은 아니며, 구현 단계에서 보강 필요)
- 상태는 항상 아이콘+텍스트로 병기되어 색상만으로 구분하지 않음 (헌법 IX, FR-023)

---

## 22. prefers-reduced-motion 규칙

다음 애니메이션은 모두 `@media (prefers-reduced-motion: no-preference)` 안에서만
활성화되며, reduced-motion 사용자는 정적 상태로 대체된다 (헌법 VII).

| 애니메이션 | 위치 | reduced-motion 시 |
|---|---|---|
| `aurora` (Hero 배경 이동) | main.html `.hero` | 고정 그라데이션 |
| `float1` (플로팅 카드 상하 이동) | main.html `.fcard-q/.fcard-a` | 고정 위치 |
| `shimmer` (스켈레톤 로딩) | list.html/question.html `.skel-bar` | 정적 회색 바 |
| `spin` (저장중 스피너) | question.html `.spinner` | 정지된 원형 테두리 |

---

## 23. 금지할 디자인 패턴

- 배지·상태 표시에 색상만 사용하고 텍스트를 생략하는 패턴 (헌법 IX)
- 답변 완료 질문에 회원 수정/삭제 버튼을 표시하거나 비활성 상태로라도 남겨두는 패턴
  (FR-015 위반)
- 내부 페이지(list.html/question.html) 카드에 과도한 그림자·과도하게 둥근 모서리
  적용 (§19, design-brief §13 "그림자 없음 또는 미세한 그림자")
- hover에만 의존해 행동 가능 여부를 알리는 패턴(예: hover 전까지 클릭 불가처럼
  보이는 카드) — 모바일에서 이해 불가능해짐
- `prefers-reduced-motion` 분기 없이 새 애니메이션을 추가하는 패턴
- 메인 페이지 CTA가 비회원 상태에서 로그인 모달 없이 보호된 화면으로 직접 이동하는
  패턴 (FR-005 위반)
- 44px 미만의 터치 타깃 버튼/입력 필드 추가
- 스펙에 없는 필터, 페이지네이션, 검색, 소셜 로그인 등 MVP 제외 기능 요소 추가
  (spec.md Assumptions, 헌법 IV·XI)

---

## 24. 구현 후 시각 검증 항목

- [ ] 데스크톱 1440px / 모바일 390px에서 세 화면 모두 레이아웃 깨짐 없이 렌더링
- [ ] 답변 대기/완료 배지가 그레이스케일로 봐도 텍스트로 구분 가능한지 확인 (헌법 IX)
- [ ] 배지 텍스트 대비가 WCAG AA(4.5:1) 이상인지 확인 (`--badge-waiting`/`--badge-done`)
- [ ] Tab 키만으로 질문 작성 → 저장, 답변 작성 → 저장 흐름을 완료할 수 있는지 확인
      (헌법 VIII)
- [ ] 포커스 이동 시 2px 블루 아웃라인이 모든 인터랙티브 요소에서 보이는지 확인
- [ ] OS 설정에서 "동작 줄이기"(reduced motion) 켠 상태로 메인 페이지 방문 시 Aurora/
      플로팅 카드 애니메이션이 정지 상태로 보이는지 확인 (헌법 VII)
- [ ] 비회원 상태에서 "질문 작성하기"/"내 질문 확인하기"/"로그인" 클릭 시 로그인
      모달이 뜨고 보호된 화면으로 직접 진입되지 않는지 확인 (FR-005, FR-022)
- [ ] 답변 완료된 질문 상세에서 회원 수정/삭제 버튼이 DOM에 존재하지 않는지 확인
      (FR-015)
- [ ] 회원 리스트에는 본인 질문만, 관리자 리스트에는 전체 질문+작성자가 보이는지 확인
      (FR-010, FR-011)
- [ ] 빈 목록/오류/권한 없음/저장 중 상태 각각이 올바른 문구와 액션 버튼으로
      표시되는지 확인 (FR-023, FR-024, FR-021)
- [ ] 질문/답변 삭제 시 확인 절차(confirm) 없이 즉시 삭제되지 않는지 확인
