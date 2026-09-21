# 따름 (TTARUM)

와인을 검색하고 찜·장바구니·주문을 이용할 수 있는 쇼핑몰 프런트엔드입니다. Next.js의 App Router와 React, TypeScript로 작성되어 있습니다.

이 저장소에는 웹 화면과 NextAuth 인증 경로가 들어 있습니다. 상품·회원·주문 데이터를 제공하는 별도 백엔드는 포함되어 있지 않습니다. 화면 코드가 존재하는 기능과 실제 사용 가능한 기능은 다를 수 있으므로 아래의 구현 상태도 확인해 주세요.

## 1. 처음 시작하기

### 준비물

- Node.js와 npm: 터미널에서 `node -v`, `npm -v`로 설치 여부를 확인합니다.
- 이 프로젝트의 소스 코드
- 상품 조회와 회원 기능까지 사용하려면 호환되는 백엔드 서버, 상품 데이터 및 테스트 계정

프로젝트에 Node.js 버전 고정 파일은 없습니다. 설치된 Next.js 13.5.4 패키지의 Node.js 최소 조건은 `>=16.14.0`이지만, 이것이 해당 버전 사용 권장이나 모든 최신 버전의 호환성 보장을 의미하지는 않습니다. 문서 작성 환경은 Node.js 24.21.0, npm 11.19.1이며 전체 설치·실행 검증은 하지 않았습니다.

### ① 프로젝트 폴더에서 패키지 설치

VS Code에서 프로젝트를 열고 **터미널 → 새 터미널**을 선택합니다. `package.json`이 있는 폴더에서 실행하세요.

```sh
npm ci
```

`npm ci`는 `package-lock.json`에 기록된 버전으로 의존성을 설치합니다. 기존 `node_modules` 폴더가 있다면 다시 구성합니다.

### ② 현재 TypeScript 설정 확인

현재 저장소의 TypeScript 버전은 `5.3.3`이지만, `tsconfig.json`에는 다음 설정이 들어 있습니다.

```json
"ignoreDeprecations": "6.0"
```

문서 작성 시 타입 검사에서 다음 오류가 발생했습니다.

```text
TS5103: Invalid value for '--ignoreDeprecations'.
```

실행·빌드 전에 `tsconfig.json`에서 이 항목을 제거하고 다시 검사하세요. 이 오류를 해결한 뒤 다른 오류가 발견될 수 있습니다. README 작성 과정에서는 설정이나 애플리케이션 코드를 변경하지 않았습니다.

### ③ 백엔드 연결 확인

`src/util/AxiosConfig.tsx`의 현재 설정은 다음과 같습니다.

```tsx
const AxiosConfig = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true,
});
```

- 프런트엔드 기본 주소: `http://localhost:3000`
- 백엔드 API 기본 주소: `http://localhost:8080/api/`
- 다른 백엔드에 연결하려면 위 파일의 `baseURL`을 수정합니다. 현재 API 주소를 환경 변수에서 읽는 코드는 없습니다.
- 백엔드에는 프런트엔드 출처에 대한 CORS 및 credentials 허용 설정이 필요합니다.

백엔드 실행법과 테스트 계정은 이 저장소에 제공되지 않습니다. 백엔드 담당자에게 실행 방법과 데이터를 확인하세요. 백엔드 없이도 정적 화면 일부는 확인할 수 있지만, 상품 조회·회원가입·일반 로그인·찜·장바구니·주문 기능의 정상 동작은 기대할 수 없습니다.

### ④ 개발 서버 실행

```sh
npm run dev
```

터미널에 표시되는 주소를 브라우저에서 엽니다. 기본 주소는 `http://localhost:3000`입니다. 서버를 종료하려면 터미널에서 `Ctrl + C`를 누릅니다.

포트를 바꾸려면 다음처럼 실행합니다.

```sh
npm run dev -- -p 3001
```

포트가 달라지면 백엔드 CORS와 소셜 로그인 주소 설정도 함께 확인해야 합니다.

## 2. 사이트 사용 순서

백엔드와 데이터가 준비되어 있다는 전제로 아래 순서로 확인하세요.

1. 홈(`/`)에서 카테고리를 선택하거나 검색(`/search`)에서 와인 이름을 입력하고 Enter를 누릅니다.
2. 상품 목록에서 상품을 선택해 상세 정보를 확인합니다.
3. 회원가입(`/join`)에서 이메일 인증 등을 진행하거나, 준비된 계정으로 로그인(`/login`)합니다.
4. 상품을 찜하거나 장바구니에 담습니다. 찜은 `/heart`, 장바구니는 `/cart`에서 확인합니다.
5. 상품 상세나 장바구니의 구매 동작을 통해 주문 화면으로 이동합니다.
6. 배송지와 주문 정보를 입력한 뒤 주문을 요청합니다. 주문 이력은 `/orderList`에서 확인합니다.
7. 마이페이지(`/user`)에서 프로필, 주문 내역, 리뷰, 배송지 관련 화면으로 이동합니다.

주문 화면은 URL의 `item` 값으로 상품 정보를 전달받습니다. `/order` 주소만 직접 입력하면 정상적인 주문 정보가 없습니다. 주문 완료·주문 상세 화면도 실제 주문 ID가 필요하므로 화면의 이동 버튼을 이용하세요.

## 3. 기능과 구현 상태

| 기능 | 코드에서 확인한 상태 |
| --- | --- |
| 상품 카테고리·검색·상세 | 백엔드 API 호출 구현 |
| 회원가입·이메일 인증·아이디 찾기 | 백엔드 API 호출 구현 |
| 아이디·비밀번호 로그인 | 백엔드 응답을 브라우저에 저장하는 흐름 구현 |
| 찜·장바구니·배송지·쿠폰 | 백엔드 API 호출 구현 |
| 주문 생성·주문 내역 | 백엔드 API 호출 구현 |
| 리뷰·상품 문의 | 조회 및 작성 등 API 호출 구현 |
| 카카오 로그인 | NextAuth 공급자와 로그인 버튼 연결, 별도 키 설정 필요 |
| 네이버·구글 로그인 | 이미지 버튼만 있으며 로그인 동작 연결 없음 |
| 소셜 회원가입 | 입력 확인과 완료 화면 표시 구현, 해당 페이지에 회원가입 API 연결 없음 |
| 비밀번호 찾기·변경 | 입력 화면 전환 구현, 해당 페이지에 실제 재설정 API 연결 없음 |
| 최근 검색어 | 예시 데이터 표시, 추가·삭제 로직은 주석 처리됨 |
| 결제 | 결제 수단 선택 UI와 주문 API 요청이 있으며, 실제 결제대행사 연동은 확인되지 않음 |

표의 “API 호출 구현”은 프런트엔드에 요청 코드가 있다는 뜻입니다. 백엔드와 연동한 성공 검증 결과는 아닙니다.

## 4. 카카오 로그인 설정

카카오 로그인을 확인할 때 프로젝트 루트(`package.json` 옆)에 `.env.local`을 만들고 다음 값을 입력합니다.

```dotenv
KAKAO_CLIENT_ID=발급받은_클라이언트_ID
KAKAO_CLIENT_SECRET=발급받은_클라이언트_SECRET
```

이 두 환경 변수는 `src/app/api/auth/[...nextauth]/route.ts`에서 읽습니다. `.env.local`은 현재 `.gitignore`에서 제외됩니다. 값을 변경한 뒤 개발 서버를 다시 시작하세요.

현재 인증 경로는 JWT 세션을 사용하며 `jwt.secret`에 고정 문자열이 들어 있습니다. 운영 환경에서 사용할 인증 설정은 별도로 정비해야 합니다. 카카오 인증 세션과 일반 로그인에서 사용하는 백엔드 토큰 저장 흐름도 분리되어 있으므로, 카카오 인증만으로 찜·주문까지 사용할 수 있다고 가정하지 마세요.

## 5. 주요 화면 주소

대괄호는 실제 값으로 바뀌는 부분입니다. 예를 들어 `/products/1`은 레드 와인 목록입니다.

| 주소 | 화면 |
| --- | --- |
| `/`, `/main` | 홈 |
| `/category` | 카테고리 선택 |
| `/products/[params]` | 카테고리별 상품 목록 |
| `/productsDetail/[itemId]` | 상품 상세 |
| `/productsDetail/[itemId]/writeAsk` | 상품 문의 작성 |
| `/search`, `/search/[params]` | 검색·검색 결과 |
| `/login`, `/join`, `/join/social` | 로그인·일반 회원가입·소셜 회원가입 |
| `/findId`, `/findPassword` | 아이디·비밀번호 찾기 |
| `/heart`, `/cart` | 찜·장바구니 |
| `/order` | 주문서 |
| `/order/deliveryList`, `/order/newDelivery` | 배송지 목록·추가 |
| `/order/[deliveryId]/editDelivery` | 배송지 수정 |
| `/successOrder?id=주문ID` | 주문 완료 |
| `/orderList`, `/orderList/detail?id=주문ID` | 주문 내역·상세 |
| `/review`, `/review/newReview`, `/review/editReview/[reviewId]` | 내 리뷰·작성·수정 |
| `/user` | 마이페이지 |

카테고리 값은 `0` 전체, `1` 레드, `2` 화이트, `3` 로제, `4` 스파클링, `5` 주정강화입니다. 상품·리뷰·배송지 ID는 백엔드에 존재하는 값을 사용해야 합니다. 작성 화면은 필요한 데이터가 전달되도록 관련 화면의 버튼으로 이동하세요.

## 6. 코드 구조와 읽는 순서

```text
.
├── public/                  # 이미지, SVG 등 정적 파일
├── src/
│   ├── app/                 # URL별 화면과 SCSS
│   │   ├── layout.tsx       # 공통 레이아웃, 인증·React Query 공급자
│   │   ├── page.tsx         # 첫 화면: main/page.tsx 렌더링
│   │   └── api/auth/        # NextAuth 인증 경로
│   ├── components/          # 헤더, 내비게이션, 상품 카드, 공통 입력 폼
│   ├── constants/           # 상품 상세 관련 상수
│   ├── hooks/               # 입력, 이미지 미리보기, 터치 스크롤 훅
│   ├── store/               # Zustand 사용자 정보·배송지 상태
│   ├── types/               # API 데이터와 상태의 TypeScript 타입
│   ├── util/                # Axios API 함수, React Query 공급자
│   └── custom.d.ts          # SVG 타입 선언
├── global.d.ts              # SCSS import 타입 선언
├── next.config.js           # Next.js·외부 이미지 설정
├── tsconfig.json            # TypeScript 설정과 @/ 경로 별칭
├── package.json             # 패키지 목록과 실행 명령
└── package-lock.json        # 의존성 버전 잠금
```

처음에는 `src/app/page.tsx` → `src/app/main/page.tsx` → `src/components/Item/ItemBox.tsx` 순서로 읽으면 화면 구성을 따라가기 쉽습니다. 로그인 흐름은 `src/app/login/page.tsx` → `src/util/AxiosMember.tsx` → `src/util/AxiosConfig.tsx` 순서로 확인하세요.

- `page.tsx`: 해당 폴더의 URL에 표시되는 화면입니다.
- `layout.tsx`: 여러 화면을 감싸는 공통 구조입니다.
- `'use client'`: 브라우저 상태나 클릭 이벤트 등을 사용하는 클라이언트 컴포넌트 표시입니다.
- `@/components/...`: `src/components/...`를 짧게 표현한 경로입니다.
- `useQuery`: 서버 데이터를 조회하고 캐시하는 데 사용합니다.
- `useMutation`: 회원가입·주문 등 데이터를 변경하는 요청에 사용합니다.

일반 로그인은 응답을 `localStorage`의 `token` 키에 저장하고, 홈에서 Zustand 사용자 상태로 가져옵니다. 사용자 상태는 `ttarum` 키로도 유지됩니다. 회원 API 함수는 사용자 토큰을 `Authorization: Bearer ...` 헤더에 넣어 요청합니다. NextAuth는 별도의 `SessionProvider`를 통해 제공됩니다.

### 무엇을 바꾸려면 어디를 볼까요?

| 수정하려는 내용 | 확인할 파일·폴더 |
| --- | --- |
| 홈 문구·배너·카테고리 | `src/app/main/page.tsx` |
| 찜 화면 모양 | `src/app/heart/page.tsx`, `src/app/heart/heart.scss` |
| 공통 헤더·하단 메뉴 | `src/components/Header/`, `src/components/Navigation/` |
| 전체 스타일·폰트 | `src/app/globals.scss`, `src/app/layout.tsx` |
| 백엔드 주소 | `src/util/AxiosConfig.tsx` |
| 상품·검색 요청 | `src/util/AxiosItem.tsx` |
| 회원·찜·장바구니·배송지 요청 | `src/util/AxiosMember.tsx` |
| 주문·리뷰·문의 요청 | `src/util/AxiosOrder.tsx`, `src/util/AxiosReview.ts`, `src/util/Axiosinquiry.tsx` |
| API 데이터 형태 | `src/types/common.ts` |
| 외부 상품 이미지 허용 호스트 | `next.config.js`의 `images` |

## 7. 사용 기술과 명령어

버전은 `package.json` 기준입니다.

| 기술 | 버전 | 용도 |
| --- | --- | --- |
| Next.js | 13.5.4 | App Router, 개발·빌드 서버 |
| React | ^18 | 화면과 이벤트 |
| TypeScript | 5.3.3 | 타입 검사 |
| TanStack React Query | ^5.28.9 | 서버 데이터 조회·변경 |
| Axios | ^1.5.1 | HTTP 요청 |
| Zustand | ^4.5.2 | 사용자·배송지 상태 |
| NextAuth | ^4.24.5 | 카카오 인증 |
| Sass / styled-components | ^1.68.0 / ^6.1.8 | 스타일 |
| react-daum-postcode | ^3.1.3 | 주소 검색 |

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행, 파일 수정 시 화면 갱신 |
| `npm run build` | 배포용 빌드 생성 |
| `npm start` | 성공적으로 생성된 빌드 실행 |
| `npm run lint` | Next.js ESLint 검사 |
| `npm run prettier` | JS·TS 파일 포맷 변경, 실제 소스 파일을 수정함 |
| `npx tsc --noEmit --incremental false` | 출력 파일을 생성하지 않는 타입 검사 |

배포용 실행 순서는 `npm run build` 후 `npm start`입니다. 현재 별도 `test` 스크립트는 없습니다.

## 8. 자주 막히는 부분

### SCSS import 오류

`Cannot find module or type declarations for side-effect import of './heart.scss'`가 보이면 다음을 확인하세요.

1. import한 파일이 같은 폴더에 존재하는지 확인합니다.
2. 루트 `global.d.ts`에 `declare module '*.scss';`가 있는지 확인합니다. 현재 저장소에는 이 선언이 있습니다.
3. `tsconfig.json`의 `include`가 선언 파일을 포함하는지 확인합니다. 현재 `**/*.ts`가 포함합니다.
4. VS Code 명령 팔레트에서 **TypeScript: Restart TS Server**를 실행합니다.

타입 선언은 없는 SCSS 파일을 만들어 주거나 잘못된 경로를 고쳐 주지는 않습니다.

### 상품이 비거나 로그인 요청이 실패하는 경우

브라우저 개발자 도구의 Network 탭에서 요청 주소와 응답을 확인하세요. 백엔드가 `localhost:8080`에서 실행 중인지, 데이터가 있는지, CORS 설정이 맞는지 확인합니다. `401`·`403` 응답이라면 로그인 상태와 백엔드 인증 조건을 확인하세요.

### 설정 또는 빌드 오류

- `TS5103`이 나타나면 위의 TypeScript 설정 확인 절차를 먼저 진행하세요.
- `next.config.js`에 `include`, `compilerOptions`가 들어 있습니다. TypeScript 설정 파일은 `tsconfig.json`이므로 Next.js 옵션 경고가 발생하면 설정 위치와 설치 버전의 지원 여부를 확인하세요.
- `layout.tsx`에는 `next/font/google`의 Inter 선언도 있습니다. 폰트 다운로드 오류가 발생하면 빌드 환경의 네트워크 접근을 확인하세요.
- 외부 이미지가 표시되지 않으면 `next.config.js`의 허용 호스트를 확인하세요. 현재 S3의 `ttarum-bucket.s3.ap-northeast-2.amazonaws.com`과 `res.cloudinary.com`이 설정되어 있습니다.

## 9. 커밋 메시지 규칙

기존 저장소에서 사용하던 규칙입니다. 예: `docs: 처음 실행하는 사람을 위한 README 작성`

| 접두사 | 의미 |
| --- | --- |
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 동작 변경 없는 코드 포맷 수정 |
| `refactor` | 코드 리팩터링 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드·패키지·개발 환경 설정 |
| `design` | CSS 등 UI 디자인 변경 |
| `comment` | 주석 추가·수정 |
| `rename` | 파일·폴더 이름 변경 |
| `remove` | 사용하지 않는 파일·폴더 삭제 |

## 10. 이 문서의 확인 범위

2026-09-21 기준으로 소스 코드, 패키지 설정, 화면 경로, API 호출, 환경 변수 참조를 확인했습니다. 설치된 TypeScript로 `--noEmit --incremental false` 검사를 실행했으며, `ignoreDeprecations` 설정 오류로 중단되었습니다. 패키지 재설치, 개발 서버·배포 빌드, 백엔드·카카오 로그인·실제 주문의 통합 실행은 검증하지 않았습니다.
