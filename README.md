# tech-blog

https://github.com/user-attachments/assets/32695646-487e-4083-a134-323ec0145b43


TechBlog는 순수 자바스크립트로 구현된 SPA(싱글 페이지 애플리케이션) 프론트엔드입니다. React 스타일의 컴포넌트를 기반으로 라우터, 전역 헤더, DTO 중심의 API 호출, 재사용 가능한 UI 조각을 구성하여 마치 React 환경에서 동작하는 것처럼 설계되어 있습니다.

## Available scripts

- `npm install` – install dependencies declared in `package.json`.
- `npm run dev` – start the Vite dev server with HMR (listen on `localhost:5173`).
- `npm run build` – type-check via `tsc` and bundle the app for production via Vite.
- `npm run preview` – serve the production build locally to sanity-check the output.

## Brief layout

- `src/main.tsx` – bootstraps React into `#root`.
- `src/App.tsx` / `src/App.css` – minimal UI that proves the React + TypeScript stack.
- `vite.config.ts`, `tsconfig*.json` – Vite and TypeScript configuration for the modern tooling.

Once dependencies are installed, open `http://localhost:5173` in your browser to confirm the setup.
