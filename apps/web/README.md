# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## State Management (Zustand)

This project uses [Zustand](https://zustand-demo.pmnd.rs/) for simple, global state management.

- Store file: `src/store/useAppStore.js`
- Example state: a counter with increment and reset actions
- Usage:
  ```js
  import { useAppStore } from '@/store/useAppStore';
  const counter = useAppStore((state) => state.counter);
  const increment = useAppStore((state) => state.increment);
  ```

## Environment Variables

- Use `.env.example` as a template for your `.env` file.
- Add variables like `VITE_PUBLIC_API_URL` for API endpoints or other settings.
- Access them in code with `import.meta.env.VITE_PUBLIC_API_URL`.
- Never commit real secrets in `.env` to version control.
