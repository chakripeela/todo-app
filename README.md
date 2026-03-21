# Todo App

A simple and elegant todo application built with React, TypeScript, and Vite.

## Features

- ✅ View all todos in a beautiful grid layout
- ➕ Create new todos with title and description
- ✓ Mark todos as complete/incomplete
- 🗑️ Delete todos
- 📱 Fully responsive design
- 🎨 Modern UI with gradient background

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
src/
├── pages/
│   ├── TodoList.tsx      # Todo list page component
│   └── CreateTodo.tsx    # Todo creation form component
├── styles/
│   ├── App.css          # Global styles
│   ├── TodoList.css     # Todo list page styles
│   └── CreateTodo.css   # Create form page styles
├── App.tsx              # Main app component with routing
├── types.ts             # TypeScript type definitions
├── main.tsx             # Entry point
└── index.css            # Global CSS
```

## Technologies Used

- **React** 19.2 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **ESLint** - Code quality

## License

MIT
