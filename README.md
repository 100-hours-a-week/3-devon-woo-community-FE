# tech-blog

React + Vite + TypeScript starter to replace the existing setup in this folder.

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
