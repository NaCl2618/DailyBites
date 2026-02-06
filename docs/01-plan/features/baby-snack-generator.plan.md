# Plan: Baby Snack Recipe Generator

**Feature ID**: baby-snack-generator
**Created**: 2026-02-06
**Status**: Planning
**Priority**: High

---

## 1. Overview

### 1.1 Feature Summary
AI 기반 아기 간식 레시피 자동 생성 서비스. 사용자가 보유한 재료를 입력하면, AI가 해당 재료를 활용한 안전하고 영양가 있는 아기 간식 레시피를 생성하고, 레시피에 맞는 이미지까지 자동으로 생성하여 제공합니다.

### 1.2 Target Users
- 생후 6개월 ~ 36개월 아기를 키우는 부모
- 빠르고 간편한 아기 간식 레시피가 필요한 사용자
- 집에 있는 재료로 즉석에서 간식을 만들고 싶은 사용자
- 안전하고 영양가 있는 이유식/간식 레시피를 찾는 초보 부모

### 1.3 Core Value
- **시간 절약**: 레시피 검색 없이 즉시 생성
- **재료 활용**: 냉장고 속 재료로 바로 만들기
- **안전성**: 아기에게 안전한 재료와 조리법 제공
- **시각화**: 완성 이미지를 미리 확인

---

## 2. Business Goals

### 2.1 Primary Goals
1. **사용자 편의성 극대화**
   - 3단계 이내로 레시피 생성 완료 (재료 입력 → 생성 → 결과)
   - 평균 생성 시간 30초 이내

2. **콘텐츠 품질 보장**
   - 영유아 영양 가이드라인 준수
   - 알레르기 유발 식품 경고
   - 월령별 적합성 표시

3. **사용자 참여 증대**
   - 레시피 저장 기능
   - 레시피 공유 기능
   - 피드백 및 평가 시스템

### 2.2 Success Metrics
- MAU (Monthly Active Users): 1,000명 (3개월 내)
- 레시피 생성 성공률: 95% 이상
- 사용자 만족도: 4.5/5.0 이상
- 평균 세션당 레시피 생성 횟수: 2.5회

---

## 3. Functional Requirements

### 3.1 Core Features

#### FR-01: 재료 입력 인터페이스
**Description**: 사용자가 보유한 재료를 입력할 수 있는 UI

**Details**:
- 자동완성 재료 검색
- 다중 재료 선택 (최소 1개, 최대 10개)
- 자주 사용하는 재료 저장 (로그인 사용자)
- 재료 카테고리 분류 (채소, 과일, 단백질, 곡류 등)

**Acceptance Criteria**:
- [ ] 재료 입력 필드에서 자동완성 동작
- [ ] 선택한 재료가 태그 형태로 표시
- [ ] 재료 삭제 가능
- [ ] 최소 1개 재료 입력 시 생성 버튼 활성화

#### FR-02: AI 레시피 생성
**Description**: 입력된 재료를 기반으로 AI가 아기 간식 레시피 생성

**Details**:
- AI 모델: OpenAI GPT-4 또는 Claude (검토 필요)
- 프롬프트 엔지니어링:
  - 아기 월령 고려 (선택 사항)
  - 알레르기 정보 고려 (선택 사항)
  - 조리 시간 선호도 (빠른/보통)
- 생성 내용:
  - 레시피 제목
  - 필요 재료 리스트 (입력 재료 + 추가 재료)
  - 조리 단계 (3~7단계)
  - 조리 시간
  - 난이도
  - 영양 정보 (선택)
  - 월령 적합도
  - 알레르기 주의사항

**Acceptance Criteria**:
- [ ] 30초 이내 레시피 생성 완료
- [ ] 생성 중 로딩 상태 표시
- [ ] 생성 실패 시 에러 메시지 및 재시도 옵션
- [ ] 입력한 재료가 레시피에 포함됨 (모두 사용할 필요는 없음)

#### FR-03: AI 이미지 생성
**Description**: 레시피를 바탕으로 완성된 간식 이미지 생성

**Details**:
- AI 모델: DALL-E 3, Midjourney, 또는 Stable Diffusion (검토 필요)
- 이미지 프롬프트: 레시피 제목 + 주요 재료 + "baby food" 키워드
- 이미지 스타일: 밝고 따뜻한 톤, 식욕을 돋우는 스타일
- 해상도: 512x512 이상
- 이미지 저장: bkend.ai 파일 스토리지

**Acceptance Criteria**:
- [ ] 레시피와 어울리는 이미지 생성
- [ ] 이미지 생성 실패 시 기본 이미지 표시
- [ ] 이미지 로딩 상태 표시
- [ ] 생성된 이미지 확대 보기 가능

#### FR-04: 결과 표시 및 상세 페이지
**Description**: 생성된 레시피와 이미지를 보기 좋게 표시

**Details**:
- 레이아웃:
  - 상단: 이미지 (전체 너비)
  - 중앙: 레시피 제목, 조리시간, 난이도, 월령
  - 하단: 재료 리스트, 조리 단계
- 액션 버튼:
  - 저장 (로그인 사용자)
  - 공유 (URL 복사, SNS 공유)
  - 다시 생성 (같은 재료로 다른 레시피)
  - 새 레시피 (재료 재입력)

**Acceptance Criteria**:
- [ ] 모바일/데스크톱 반응형 디자인
- [ ] 레시피 내용 복사 가능
- [ ] 이미지 다운로드 가능
- [ ] 공유 URL 생성 (비로그인 사용자도 가능)

#### FR-05: 레시피 저장 및 관리 (로그인 사용자)
**Description**: 마음에 드는 레시피를 저장하고 나중에 다시 볼 수 있는 기능

**Details**:
- 저장 위치: bkend.ai 데이터베이스 (recipes 컬렉션)
- 저장 정보:
  - 레시피 전체 내용
  - 생성 이미지 URL
  - 생성 일시
  - 사용자 메모 (선택)
- 내 레시피 페이지:
  - 저장된 레시피 목록 (카드 형태)
  - 검색 및 필터 (재료별, 날짜별)
  - 삭제 기능

**Acceptance Criteria**:
- [ ] 저장 버튼 클릭 시 즉시 저장
- [ ] 중복 저장 방지
- [ ] 내 레시피 페이지에서 목록 확인
- [ ] 저장된 레시피 상세보기 가능

### 3.2 Optional Features (Phase 2)

#### OF-01: 월령별 필터링
- 생후 6~12개월, 12~24개월, 24개월 이상 선택
- 월령에 따라 적합한 재료와 조리법 제안

#### OF-02: 알레르기 관리
- 사용자 프로필에 알레르기 정보 저장
- 알레르기 유발 재료 자동 제외

#### OF-03: 영양 정보 상세 표시
- 칼로리, 단백질, 탄수화물, 지방 등

#### OF-04: 레시피 평가 및 리뷰
- 별점 평가
- 실제 만든 후기 작성
- 사진 첨부

#### OF-05: 커뮤니티 기능
- 인기 레시피 TOP 10
- 최근 생성된 레시피
- 다른 사용자 레시피 검색

---

## 4. Technical Requirements

### 4.1 Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (전역 상태), TanStack Query (서버 상태)
- **Form Handling**: React Hook Form + Zod validation

### 4.2 Backend
- **Platform**: bkend.ai BaaS
- **Database**: MongoDB (via bkend.ai)
- **Collections**:
  - `recipes`: 저장된 레시피
  - `users`: 사용자 정보 (bkend.ai 기본 제공)
  - `ingredients`: 재료 마스터 데이터 (자동완성용)

### 4.3 External APIs
- **AI 레시피 생성**:
  - Option A: OpenAI GPT-4 API
  - Option B: Anthropic Claude API
  - Decision: 비용, 품질, 속도 비교 후 결정

- **AI 이미지 생성**:
  - Option A: OpenAI DALL-E 3 API
  - Option B: Stable Diffusion API
  - Decision: 비용, 품질, 속도 비교 후 결정

### 4.4 Performance Requirements
- **레시피 생성 시간**: 평균 30초 이내
- **이미지 생성 시간**: 평균 15초 이내
- **페이지 로드 시간**: 3초 이내 (First Contentful Paint)
- **모바일 최적화**: 필수

---

## 5. User Flow

### 5.1 Main Flow (비로그인 사용자)

```
1. 랜딩 페이지 접속
   ↓
2. "재료 입력하기" 버튼 클릭
   ↓
3. 재료 입력 페이지
   - 재료 검색 및 선택 (1~10개)
   - [선택] 월령 선택
   - [선택] 알레르기 정보
   - [선택] 조리 시간 선호도
   ↓
4. "레시피 생성" 버튼 클릭
   ↓
5. 로딩 화면 (AI 생성 중...)
   - 레시피 생성 (15~30초)
   - 이미지 생성 (10~20초)
   ↓
6. 결과 페이지
   - 레시피 + 이미지 표시
   - 공유, 다시 생성, 새 레시피 버튼
```

### 5.2 Saved Recipe Flow (로그인 사용자)

```
1. 결과 페이지에서 "저장" 버튼 클릭
   ↓
2. 레시피 저장 완료 (토스트 알림)
   ↓
3. "내 레시피" 페이지 이동 (선택)
   ↓
4. 저장된 레시피 목록 확인
   ↓
5. 레시피 카드 클릭
   ↓
6. 저장된 레시피 상세보기
```

---

## 6. UI/UX Considerations

### 6.1 Design Principles
- **Simple & Clean**: 직관적이고 깔끔한 디자인
- **Mobile First**: 모바일 우선 설계
- **Fast Feedback**: 모든 액션에 즉각적인 피드백
- **Accessibility**: WCAG 2.1 AA 레벨 준수

### 6.2 Key Screens
1. **랜딩 페이지**
   - 서비스 소개
   - 주요 기능 강조
   - CTA: "시작하기" 버튼

2. **재료 입력 페이지**
   - 재료 검색 (자동완성)
   - 선택된 재료 태그
   - 옵션 설정 (월령, 알레르기 등)

3. **로딩 페이지**
   - 프로그레스 바 또는 애니메이션
   - 재미있는 팁 또는 문구

4. **결과 페이지**
   - 이미지 (상단, 전체 너비)
   - 레시피 정보
   - 액션 버튼

5. **내 레시피 페이지** (로그인 사용자)
   - 레시피 카드 그리드
   - 검색 및 필터

### 6.3 Color Scheme
- **Primary**: 따뜻한 오렌지/피치 계열 (아기, 건강, 따뜻함)
- **Secondary**: 부드러운 그린 계열 (자연, 신선함)
- **Accent**: 밝은 옐로우 (에너지, 기쁨)
- **Neutral**: 화이트, 라이트 그레이

---

## 7. Data Schema (Initial)

### 7.1 recipes Collection
```typescript
interface Recipe {
  _id: string;
  userId: string;              // 저장한 사용자 ID
  title: string;               // 레시피 제목
  ingredients: {               // 재료 목록
    name: string;
    amount: string;
    isInputIngredient: boolean; // 사용자가 입력한 재료인지
  }[];
  steps: string[];            // 조리 단계
  cookingTime: number;        // 조리 시간 (분)
  difficulty: 'easy' | 'medium' | 'hard';
  ageRange: string;           // 적합 월령 (예: "12-24개월")
  allergyWarnings: string[];  // 알레르기 경고
  imageUrl: string;           // 생성된 이미지 URL
  imagePrompt: string;        // 이미지 생성에 사용된 프롬프트
  nutritionInfo?: {           // 영양 정보 (선택)
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  userNote?: string;          // 사용자 메모
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.2 ingredients Collection (마스터 데이터)
```typescript
interface Ingredient {
  _id: string;
  name: string;               // 재료 이름
  category: string;           // 카테고리 (채소, 과일, 곡류 등)
  allergyRisk: boolean;       // 알레르기 위험 여부
  minAge: number;             // 최소 권장 월령
  keywords: string[];         // 검색 키워드
}
```

---

## 8. Risks & Mitigation

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI API 응답 시간 지연 | High | Medium | 로딩 상태 표시, 타임아웃 설정, 캐싱 전략 |
| AI 생성 품질 불량 | High | Medium | 프롬프트 최적화, A/B 테스트, 사용자 피드백 수집 |
| API 비용 초과 | Medium | High | 사용량 모니터링, 일일 한도 설정, 캐싱 |
| 이미지 저장 용량 초과 | Medium | Medium | 이미지 압축, CDN 활용, 오래된 데이터 정리 |

### 8.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 사용자 획득 저조 | High | Medium | 마케팅 전략 수립, SEO 최적화, 무료 체험 |
| 레시피 안전성 문제 | High | Low | 영양사 검토, 면책 조항, 신고 시스템 |
| 경쟁 서비스 등장 | Medium | Medium | 차별화 기능 강화, 커뮤니티 구축 |

---

## 9. MVP Scope

### Phase 1 (MVP) - 4주
**Goal**: 핵심 기능 구현 및 검증

**Included**:
- ✅ FR-01: 재료 입력 (기본)
- ✅ FR-02: AI 레시피 생성
- ✅ FR-03: AI 이미지 생성
- ✅ FR-04: 결과 표시
- ✅ FR-05: 레시피 저장 (로그인 사용자)
- ✅ 회원가입/로그인 기능
- ✅ 반응형 디자인 (모바일/데스크톱)

**Excluded** (Phase 2):
- ❌ 월령별 필터링
- ❌ 알레르기 관리
- ❌ 영양 정보 상세
- ❌ 레시피 평가/리뷰
- ❌ 커뮤니티 기능

### Success Criteria (MVP)
- 레시피 생성 성공률 > 90%
- 평균 생성 시간 < 45초
- 50명 베타 테스터 확보
- 사용자 만족도 > 4.0/5.0

---

## 10. Timeline & Milestones

### Week 1: 설계 및 환경 설정
- Day 1-2: Design 문서 작성
- Day 3-4: API 선정 (OpenAI vs Claude, DALL-E vs SD)
- Day 5-7: 프로젝트 환경 설정, 기본 UI 컴포넌트

### Week 2: 핵심 기능 구현
- Day 8-10: 재료 입력 UI 및 자동완성
- Day 11-12: AI 레시피 생성 API 통합
- Day 13-14: AI 이미지 생성 API 통합

### Week 3: 결과 표시 및 저장
- Day 15-17: 결과 페이지 UI
- Day 18-19: 레시피 저장 기능
- Day 20-21: 내 레시피 페이지

### Week 4: 테스트 및 배포
- Day 22-24: 통합 테스트, 버그 수정
- Day 25-26: 성능 최적화, SEO
- Day 27-28: 배포 및 베타 테스트 시작

---

## 11. Dependencies

### 11.1 External Dependencies
- OpenAI API 또는 Anthropic API 계정
- DALL-E 3 또는 Stable Diffusion API 계정
- bkend.ai 프로젝트 설정 완료
- 도메인 및 호스팅 (Vercel)

### 11.2 Team Dependencies
- AI 프롬프트 엔지니어링 지식
- Next.js 및 React 개발 경험
- UI/UX 디자인 역량

---

## 12. Out of Scope (명확히 제외)

- ❌ 영상 콘텐츠 생성
- ❌ 실시간 채팅 지원
- ❌ 다국어 지원 (Phase 1에서는 한국어만)
- ❌ 오프라인 모드
- ❌ 네이티브 앱 (웹 앱만)
- ❌ 유료 구독 모델 (MVP에서는 무료)
- ❌ 관리자 페이지

---

## 13. Next Steps

1. ✅ Plan 문서 작성 완료
2. ⏭️ **Design 문서 작성** (`/pdca design baby-snack-generator`)
3. ⏭️ AI API 선정 및 테스트
4. ⏭️ UI 프로토타입 제작
5. ⏭️ 개발 시작

---

## 14. Questions & Decisions

### Pending Decisions
- [ ] **AI 모델 선택**: OpenAI GPT-4 vs Claude Sonnet?
  - 비용: OpenAI $0.01/1K tokens vs Claude $0.003/1K tokens
  - 품질: 실제 테스트 필요

- [ ] **이미지 생성 API**: DALL-E 3 vs Stable Diffusion?
  - DALL-E 3: $0.04/image (고품질, 빠름)
  - Stable Diffusion: $0.002/image (저렴, 품질 가변)

- [ ] **재료 마스터 데이터**: 직접 구축 vs 외부 API?
  - 직접 구축: 초기 100개 재료로 시작
  - 외부 API: 식품영양성분 DB 활용 검토

### Open Questions
- Q1: 비로그인 사용자도 레시피 생성 가능하도록 할지?
  - A: YES - 진입장벽을 낮춰 사용자 경험 우선

- Q2: 생성된 레시피의 저작권은?
  - A: AI 생성 콘텐츠는 플랫폼 소유, 사용자는 개인적 사용 가능

- Q3: 일일 생성 제한을 둘 것인지?
  - A: MVP에서는 비로그인 3회, 로그인 10회 제한

---

**Plan Document Version**: 1.0
**Last Updated**: 2026-02-06
**Next Phase**: Design
