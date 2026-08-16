# 01 React Mental Model And JSX

[Back to React Study Plan](../README.md)

## Goal

Understand React as JavaScript functions that return UI.

## Start The App

Create the app from scratch:

```powershell
pnpm create vite
cd product-review-tracker
pnpm install
pnpm add tailwindcss @tailwindcss/vite
pnpm dev
```

During the Vite prompts, choose:

```text
Project name: product-review-tracker
Framework: React
Variant: TypeScript
```

Add Tailwind to `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Add Tailwind to `src/index.css`:

```css
@import "tailwindcss";
```

Use Tailwind as copy/paste styling only. Focus on React first.

## Learn

- Component as function.
- JSX as JavaScript syntax for UI.
- Rendering data into markup.
- Expressions inside JSX.
- Why React is declarative.

## App Step

Start the Product Review Tracker in one file.

Build static product cards from hard-coded data.

## UI Target

![Static product cards](../assets/01-static-product-cards.png)

## Tailwind Classes To Reuse

```text
Page: min-h-screen bg-slate-50 p-6 text-slate-950
Shell: mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm
Title: text-3xl font-bold tracking-normal
Card Grid: grid gap-4 md:grid-cols-3
Card: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
Badge New: rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700
Badge Reviewed: rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700
```

## Stop When You Can Explain

- What a React component returns.
- Why JSX is not a string template.
- How data becomes UI.
