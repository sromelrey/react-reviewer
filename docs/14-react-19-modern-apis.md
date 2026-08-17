# 14 React 19 Modern APIs Overview

[Back to React Study Plan](../README.md)

## Goal

Recognize modern React APIs without mixing them too early into fundamentals.

By the end of this lesson, you should understand how modern React APIs relate to the app you already built.

## Big Words

### Big Word Alert: use

`use` can read a context or a promise.

Unlike normal Hooks, React allows `use` in loops and conditionals.

### Big Word Alert: Action

An Action is an async function used by React for a UI transition, often around form submissions.

### Big Word Alert: useActionState

`useActionState` manages state returned from an Action.

### Big Word Alert: useFormStatus

`useFormStatus` reads pending form submission state from the nearest parent form.

### Big Word Alert: useOptimistic

`useOptimistic` shows temporary optimistic UI while async work is pending.

### Conceptual Aside: Learn The Manual Flow First

You already built loading, forms, and optimistic update manually.

That makes React 19 APIs easier to understand because you know what problems they are trying to reduce.

## App Step

Do not rewrite the whole app yet.

Compare how the review form or optimistic update could look with newer APIs.

## What To Compare

Compare the app's current flow against React 19 APIs:

| Existing App Flow | React 19 API To Compare |
| --- | --- |
| manual form state | `useActionState` |
| manual pending state | `useFormStatus` |
| manual optimistic update | `useOptimistic` |
| manual async read patterns | `use` |

## Build Steps

1. Do not replace the whole app.
2. Pick one small form or optimistic update.
3. Sketch how it would look with `useActionState`.
4. Sketch how pending UI would use `useFormStatus`.
5. Compare manual optimistic update with `useOptimistic`.
6. Write notes on what becomes simpler and what becomes more framework-specific.

## UI Target

This is a comparison lesson, not a redesign.

Visible UI change:

```text
none required
optional comparison panel only if it helps you remember the difference
```

Use a markdown note or small comparison section in the app only if you want a visible reminder:

```text
Manual flow: useState + submit handler + pending state
React 19 flow: action + useActionState + useFormStatus
Optimistic flow: manual rollback vs useOptimistic
```

## Tailwind Classes To Reuse

If you add an optional comparison panel, keep it quiet:

```text
Comparison Panel: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
Comparison Grid: grid gap-4 md:grid-cols-2
Comparison Heading: text-base font-semibold text-slate-950
Comparison Text: mt-2 text-sm leading-6 text-slate-600
Code Label: rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700
```

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "docs(react): compare react 19 app patterns"
git push
```

## Common Mistakes

- Mixing React 19 APIs into fundamentals before understanding state and effects.
- Thinking `use` is the same as `useEffect`.
- Treating optimistic UI as confirmed server data.
- Rewriting the app just to use a new API.

## Stop When You Can Explain

- Why `use` is different from normal Hooks.
- What Action-based forms solve.
- How `useOptimistic` relates to the manual optimistic update from lesson 12.
- Why this lesson is a comparison instead of a full rewrite.
