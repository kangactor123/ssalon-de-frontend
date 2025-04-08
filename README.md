# Ssalon De Frontend

Ssalon De Frontend는 미용실의 매출 관리를 위한 웹 애플리케이션입니다. Next.js와 TypeScript를 기반으로 개발되었으며, 사용자가 직관적으로 예약 및 매출을 관리할 수 있도록 설계되었습니다.

## 🛠 기술 스택

- **Framework**: Next.js
- **Language**: TypeScript
- **State Management**: Zustand, @tanstack/react-query
- **Styling**: Tailwind CSS

## 📂 프로젝트 구조

```plaintext
ssalon-de-frontend/
├── app/
│   ├── (afterAuth)/         # 인증 이후의 페이지 그룹
│   ├── (beforeAuth)/       # 인증 이전의 페이지 그룹
│   ├── api/      # Next.js의 API Route
├── assets/       # 프론트엔드에서 사용하는 정적 에셋 디렉토리
├── queries/
├── shared/
├── zustand/
└── README.md
```

## 🚀 시작하기

### 1. 프로젝트 클론

```sh
git clone https://github.com/kangactor123/ssalon-de-frontend.git
cd ssalon-de-frontend
```

### 2. 의존성 설치

```sh
pnpm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

### 4. 개발 서버 실행

```sh
pnpm dev
```

## 🏗️ 배포

### 배포

Vercel을 사용하여 배포하고 있으며 main 브랜치에 병합이 되면 Vercel production으로 자동 배포됩니다!
