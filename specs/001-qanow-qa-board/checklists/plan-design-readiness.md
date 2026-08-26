# Plan/Design Readiness Checklist: QANOW 질문·답변 게시판

**Purpose**: spec.md, design.md, plan.md가 구현을 시작하기에 충분한 품질과 완결성을
갖추고 있는지 검증하는 요구사항 품질 체크리스트 ("요구사항에 대한 단위 테스트").
구현 여부가 아니라 문서화된 요구사항 자체의 완전성·명확성·일관성을 검사한다.
**Created**: 2026-08-21
**Feature**: [spec.md](../spec.md) · [design.md](../design.md) · [plan.md](../plan.md)

**Note**: 이 체크리스트는 `/speckit-checklist` 명령으로 생성되었다.
**Review Ownership**: 이 체크리스트는 리뷰어 소유의 요구사항 품질 검토 문서다. 리뷰어가
해당 기준이 요구사항 관점에서 충족되었다고 판단할 때만 `[x]`로 표시한다.
**Marker Semantics**: `[x]`는 요구사항이 검토되어 품질 기준을 만족함을 뜻할 뿐,
구현이 완료되었음을 뜻하지 않는다.

---

## 1. 사용자 역할과 데이터 범위 (Role & Data Scope)

- [x] CHK001 - 비회원·회원·관리자 세 역할의 권한 경계가 서로 겹치지 않게 문서화되어
  있는가? [Completeness, Spec §Key Entities, 헌법 원칙 I]
- [x] CHK002 - 회원이 조회 가능한 질문 범위("본인 것만")와 관리자가 조회 가능한 범위
  ("전체")가 spec.md와 design.md 양쪽에서 동일하게 서술되는가? [Consistency, Spec
  §FR-010·FR-011, design.md §6]
- [x] CHK003 - 관리자 계정 발급/부여 절차가 명시되어 있는가, 아니면 명시적으로
  범위 밖으로 선언되어 있는가? [Completeness, Spec §Assumptions]
- [x] CHK004 - 리스트 화면에서 회원 뷰와 관리자 뷰의 표시 항목 차이(작성자 노출 여부 등)가
  정량적으로 정의되어 있는가? [Clarity, design.md §6·§11]

## 2. 답변 전후 수정·삭제 규칙 (Edit/Delete Lifecycle)

- [x] CHK005 - 답변 등록 전 회원이 수행 가능한 행동(수정/삭제)과 답변 등록 후 금지되는
  행동이 하나의 표 또는 문장으로 명확히 대응되어 있는가? [Clarity, Spec §FR-013~FR-015]
- [x] CHK006 - "답변 등록 이후 수정·삭제 차단"이 UI 레벨 요구사항과 데이터 계층 강제
  요구사항으로 각각 구분되어 명시되어 있는가? [Completeness, Spec §FR-015, 헌법 원칙 II]
- [x] CHK007 - 회원이 질문을 수정하는 도중 관리자가 먼저 답변을 등록하는 동시성 시나리오의
  처리 결과(저장 거부 + 오류 문구)가 정의되어 있는가? [Coverage, Spec §Edge Cases]
- [x] CHK008 - 관리자의 기존 답변 수정 가능 여부와, 답변 수정에 새 유효성 규칙이
  적용되는지가 명시되어 있는가? [Completeness, Spec §FR-019]
  > **보정 완료**: FR-019에 "수정 시에도 FR-017의 길이 규칙을 동일하게 적용해야
  > 한다"를 추가해 FR-013과 동일한 패턴으로 교차 참조를 명시함(spec.md 2026-08-21).

## 3. 권한 없는 접근 처리 (Unauthorized Access)

- [x] CHK009 - 회원이 타인의 질문 URL에 직접 접근했을 때의 화면 상태(문구, 액션 버튼)가
  spec.md와 design.md에서 동일한 문구로 일치하는가? [Consistency, Spec §FR-021,
  design.md §14]
- [x] CHK010 - 비회원이 보호된 화면(질문 작성/리스트/상세)에 접근할 때의 처리 방식이
  화면별로 각각 정의되어 있는가, 아니면 하나의 공통 규칙으로만 서술되어 모호한가?
  [Clarity, Spec §FR-022]
  > **보정 완료**: design.md §5에 "비회원의 보호된 화면 직접 접근" 단락을 추가해
  > list.html/question.html 직접 접근 시 main.html로 리다이렉트 후 로그인 모달을
  > 자동으로 여는 단일 동작으로 명시함(2026-08-21).
- [x] CHK011 - 로그인 세션 만료 중 저장을 시도하는 경우의 동작(저장 거부 + 로그인 안내
  전환)이 다른 오류 상태와 구분되게 정의되어 있는가? [Coverage, Spec §Edge Cases]

## 4. 입력 길이와 빈 값 처리 (Input Validation)

- [x] CHK012 - 제목/내용/답변 각각의 최소·최대 길이와 "공백 제거 후" 기준이 세 필드
  모두에 동일한 표현으로 일관되게 적용되어 있는가? [Consistency, Spec §FR-007·FR-008·FR-017]
- [x] CHK013 - 공백만 입력된 경우의 거부 규칙이 신규 작성과 수정 양쪽 시나리오 모두에
  대해 명시되어 있는가? [Coverage, Spec §FR-013, §Edge Cases]
- [x] CHK014 - 글자 수 힌트("0/100", "0/5000") 표시 규칙이 design.md에 UI 요소로
  정의되어 있고, 그 값의 유효성 판정 기준(spec.md)과 일치하는가? [Consistency,
  design.md §12, Spec §FR-007·FR-008]

## 5. 성공 기준의 측정 가능성 (Measurable Success Criteria)

- [x] CHK015 - SC-001~SC-007 각각이 구체적 수치(시간, 비율, 횟수)로 표현되어 객관적으로
  검증 가능한가? [Measurability, Spec §Success Criteria]
- [x] CHK016 - "즉시 확인 가능"(SC-004)과 같은 표현이 추가 조작 없음이라는 조건으로
  구체화되어 모호하지 않은가? [Clarity, Spec §SC-004]
- [x] CHK017 - 데스크톱·모바일 완결성 기준(SC-007)이 검증할 구체적 화면 폭(예: 1440px,
  390px)까지 지정되어 있는가? [Measurability, Spec §SC-007, design.md §20]

## 6. 제외 범위 (Out-of-Scope Boundaries)

- [x] CHK018 - MVP 제외 항목(파일 첨부, 댓글, 검색, 페이지네이션, 소셜 로그인, 통계
  대시보드)이 spec.md의 Assumptions와 design.md §23 금지 패턴 양쪽에서 상충 없이
  일치하는가? [Consistency, Spec §Assumptions, design.md §23]
- [x] CHK019 - 회원가입 링크 등 화면에 노출되지만 MVP 밖으로 명시된 요소(예: 로그인
  모달의 "회원가입 링크 → MVP 제외")가 design.md에도 동일하게 반영되어 있는가?
  [Consistency, design-brief.md §9, design.md §5]
  > **보정 완료**: design.md §5에 로그인 모달에는 회원가입 링크를 두지 않는다는
  > 문장을 추가하고, §7에는 헤더의 "회원가입" 버튼이 FR-001 범위(MVP 포함)이며
  > design-brief의 MVP 제외 대상은 모달 내부 링크였음을 명확히 구분함(2026-08-21).

## 7. 세 핵심 화면의 정보 구조 (design.md Structure Completeness)

- [x] CHK020 - 메인/리스트/질문 세 화면 각각의 화면 목적과 필수 구성 요소가 design.md에
  섹션 단위로 빠짐없이 정의되어 있는가? [Completeness, design.md §3·§4]
- [x] CHK021 - 화면 간 이동 경로(§5)에 정의된 모든 전이가 각 화면의 레이아웃 섹션(§4)에
  대응하는 실제 버튼/링크로 뒷받침되는가? [Consistency, design.md §4·§5]

## 8. 디자인 토큰 → CSS 구현 계획

- [x] CHK022 - design.md에 정의된 디자인 토큰(§15)을 실제 프레임워크의 CSS
  변수/테마 파일로 변환하는 방법과 대상 파일이 plan.md에 정의되어 있는가?
  [Gap — plan.md 미작성, design.md §15]
  > **보정 완료**: plan.md §2에 토큰을 `src/styles/tokens.css`로 1:1 복사하는
  > 방법과 근거를 명시함(2026-08-21).
- [x] CHK023 - 배지 전용 토큰(`--badge-waiting`/`--badge-done`)처럼 원본 브랜드 색상과
  분리된 접근성 보정 토큰이 왜 분리되었는지 근거가 문서화되어, 구현자가 원본 색상으로
  되돌리지 않도록 안내되어 있는가? [Clarity, design.md §15]

## 9. 메인 Hero 시각 효과 구현 범위

- [x] CHK024 - Aurora Gradient·Grid Glow·Floating Card 세 효과 각각의 구현 기술
  (CSS keyframe vs. JS 애니메이션 라이브러리 등)이 plan.md에 지정되어 있는가?
  [Gap — plan.md 미작성, design.md §10]
  > **보정 완료**: plan.md §3에 세 효과 모두 순수 CSS(keyframes/미디어쿼리)로
  > 구현하고 JS 라이브러리를 쓰지 않는다고 명시함(2026-08-21).
- [x] CHK025 - 1024px 이하에서 플로팅 카드가 정적 레이아웃으로 전환되는 조건이
  구현 대상 컴포넌트 경계(예: 별도 컴포넌트 vs. CSS 미디어쿼리)까지 명시되어
  있는가? [Clarity, design.md §10]
  > **보정 완료**: design.md §10에 "구현 기법" 문단을 추가해 순수 CSS 미디어쿼리로만
  > 처리하고 JS 조건부 렌더링을 쓰지 않는다고 명시함(2026-08-21).

## 10. prefers-reduced-motion 대응

- [x] CHK026 - reduced-motion 분기가 필요한 애니메이션 목록(Aurora, Float, Shimmer,
  Spinner)이 design.md에 전부 나열되고, 각각의 "정지 시 대체 상태"가 정의되어
  있는가? [Completeness, design.md §22]
- [x] CHK027 - reduced-motion 요구사항이 헌법 원칙 VII의 검토 기준("모든 애니메이션에
  분기 존재")과 1:1로 대응되는지 확인 가능한가? [Traceability, 헌법 원칙 VII,
  design.md §22]

## 11. Loading / Empty / Error / Unauthorized 상태

- [x] CHK028 - 네 가지 상태 각각의 트리거 조건, 표시 문구, 제공 액션이 화면별로
  표(§14)에 빠짐없이 정리되어 있는가? [Completeness, design.md §14, Spec §FR-023]
- [x] CHK029 - Empty 상태의 역할별 문구 차이(회원 vs 관리자)가 FR-024와 design.md
  §6·§14에서 동일한 문구로 일치하는가? [Consistency, Spec §FR-024, design.md §6·§14]
- [x] CHK030 - "저장 중" 상태가 다른 네 상태와 달리 폼 요소 위에 오버레이로 표시된다는
  차별점이 명시적으로 문서화되어, 구현 시 혼동되지 않도록 되어 있는가? [Clarity,
  design.md §14]

## 12. 회원·관리자 UI 차이

- [x] CHK031 - 회원/관리자 UI 차이표(design.md §6)의 각 행이 spec.md의 대응 FR과
  모두 추적 가능한가(누락된 FR 참조가 없는가)? [Traceability, design.md §6]
- [x] CHK032 - 역할 전환 로직(현재는 URL 파라미터/데모 스위처)을 실제 인증 세션 기반
  역할 판정으로 교체하는 방법이 plan.md에 정의되어 있는가? [Gap — plan.md 미작성,
  design.md §6]
  > **보정 완료**: plan.md §4에 `useAuth()` 훅 인터페이스를 유지한 채 mockSession을
  > Supabase 세션+profiles.role 조회로 교체하는 방법을 명시함(2026-08-21).

## 13. 구현 순서: UI Mock → /design-sync → Supabase 연결

- [x] CHK033 - "UI Mock 구현 완료 후 `/design-sync` 실행"이라는 순서 자체가 plan.md
  또는 다른 계획 문서에 문서화되어 있는가? [Gap — plan.md가 존재하지 않아 이 순서를
  검증할 문서가 없음]
  > **보정 완료**: plan.md §5에 Phase1~8 순서와 게이트 A/B를 명시함(2026-08-21).
- [x] CHK034 - `/design-sync` 실행의 완료 기준(무엇이 확인되어야 다음 단계로 넘어가는지)이
  정의되어 있는가? [Gap — plan.md 미작성]
  > **보정 완료**: plan.md §5 "게이트 B 완료 기준"에 T042·T043 통과를 명시함(2026-08-21).
- [x] CHK035 - Supabase 연결(데이터 계층 구현)이 `/design-sync` 완료 이후에만
  시작되어야 한다는 순서 제약이 plan.md에 선행조건으로 명시되어 있는가, 아니면
  구현자의 판단에 맡겨져 있는가? [Gap — plan.md 미작성]
  > **보정 완료**: plan.md §5에 "게이트 A·B를 통과하지 못한 상태에서 Phase 5 이후
  > Task를 시작하지 않는다"를 선행조건으로 명시함(2026-08-21).
- [x] CHK036 - Supabase 연결 이전에 UI가 정적 mock 데이터로만 동작해야 한다는 제약이,
  헌법 원칙 II(데이터 계층 최종 강제)와 충돌하지 않는 임시 상태로 명확히 범위가
  한정되어 있는가? [Ambiguity, 헌법 원칙 II]
  > **보정 완료**: design.md §6에 "Mock 단계와 헌법 원칙 II의 관계" 단락을 추가해
  > Mock 단계는 헌법 II의 예외가 아니라 데이터 계층이 아직 구축되지 않은 개발
  > 중간 단계이며 Phase 5 RLS 적용 전까지 "구현 완료"로 간주하지 않음을
  > 명시함(2026-08-21).

---

## Notes

- 리뷰 결과 요구사항 품질 기준이 충족되었다고 판단될 때만 항목을 `[x]`로 표시한다.
  아직 보정이 필요하면 체크하지 않은 채로 둔다.
- `/speckit-implement`는 이 체크리스트의 체크 상태를 게이트로 참조하되 마커를
  직접 수정하지 않는다.
- `checklists/requirements.md`는 `/speckit-specify`·`/speckit-clarify`가 관리하는
  별도 생명주기의 스펙 품질 체크리스트이며, 이 문서와 독립적으로 유지된다.
- 2026-08-21: `plan.md`(최소 버전) 작성 및 spec.md/design.md 보정을 반영해 CHK008,
  010, 019, 022, 024, 025, 032~036 총 11개 항목을 재검토 후 통과 처리함. 이로써
  36/36 항목이 모두 통과 상태다.
