# Doodle Chat Frontend

A real-time chat application built as part of the Doodle Frontend Challenge, demonstrating modern React patterns and server-first architecture.

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-06B6D4)

## Features

- **Real-time messaging** with automatic polling and cache revalidation
- **User identity management** via secure HTTP-only cookies
- **Server-first architecture** with surgical client-side hydration
- **Accessible UI** with semantic HTML and ARIA labels
- **Type-safe** end-to-end with TypeScript strict mode
- **Environment validation** at startup using Zod schemas

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org) | 16.1.3 | Framework with App Router |
| [React](https://react.dev) | 19.2.3 | UI library with React Compiler |
| [TypeScript](https://typescriptlang.org) | 5.9.3 | Type safety (strict mode) |
| [Tailwind CSS](https://tailwindcss.com) | 4.1.18 | Utility-first styling |
| [Zod](https://zod.dev) | 4.3.5 | Runtime validation |
| [Biome](https://biomejs.dev) | 2.3.11 | Linting & formatting |

## Getting Started

### Prerequisites

- Node.js >= 24.13.0
- npm >= 11.7.0

### Environment Setup

Create a `.env.local` file in the root directory:

```env
BE_API_URL=http://localhost:3000
AUTH_TOKEN=super-secret-doodle-token
```

> **Note:** Values shown are for demo purposes. In production, secrets should be stored securely.

### Installation

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:3003](http://localhost:3003)

### Backend API

This frontend consumes the [Doodle Chat API](https://github.com/DoodleScheduling/frontend-challenge-chat-api). Ensure the backend is running before starting the frontend.

## Architecture

### Design Principles

1. **Server Components by default** — Client directives (`"use client"`) are used only when browser APIs or interactivity are required
2. **React Compiler enabled** — Automatic memoization for optimal re-renders
3. **Server Actions for mutations** — No API route boilerplate; forms submit directly to server functions
4. **Tag-based revalidation** — Granular cache invalidation without full page refreshes

### Project Structure

```
app/
├── components/
│   ├── ChatFeed/              # Message display with auto-scroll
│   │   ├── MessageDate/       # Locale-aware timestamp formatting
│   │   ├── ChatFeedWrapper.tsx # Client wrapper for polling & scroll
│   │   ├── ChatFeed.types.ts
│   │   └── index.tsx
│   ├── SendMessage/           # Message input form
│   │   ├── actions.ts         # Server action for POST
│   │   └── index.tsx
│   └── UserSelector/          # Username management
│       ├── actions.ts         # Cookie-based identity
│       ├── UserSelector.types.ts
│       └── index.tsx
├── lib/
│   ├── config/env.ts          # Zod-validated environment
│   └── cookies/username.ts    # Cookie utilities
├── layout.tsx
├── page.tsx
└── globals.css
```

### Component Conventions

| File | Purpose |
|------|---------|
| `index.tsx` | Main component export |
| `[Component].types.ts` | TypeScript interfaces and types |
| `actions.ts` | Server Actions for data mutations |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3003 |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |

## Key Implementation Details

### Polling Strategy

Messages are refreshed every 5 seconds using client-side polling that triggers server-side cache revalidation via `revalidateTag()`. This approach:

- Keeps the server as the source of truth
- Leverages Next.js caching for efficiency

### Cookie-Based Identity

Username is stored in an HTTP-only secure cookie with a 1-year expiration, managed entirely through Server Actions for security.

---

**Author:** Darío López
