# 10 useMemo, useCallback, And memo

[Back to React Study Plan](../README.md)

## Goal

Understand memoization without overusing it.

By the end of this lesson, the app should use memoization only where references matter.

## Big Words

### Big Word Alert: memo

`memo` lets React skip re-rendering a component when its props are the same.

### Big Word Alert: useMemo

`useMemo` memoizes a calculated value between renders.

Use it for values.

### Big Word Alert: useCallback

`useCallback` memoizes a function reference between renders.

Use it for functions.

### Big Word Alert: Referential Equality

Referential equality means two values are the same reference in memory.

Objects, arrays, and functions can look the same but still be different references.

### Conceptual Aside: Memoization Is Not A Default

Memoization has a cost and can make code harder to read.

Use it when it protects a real component boundary or expensive calculation.

## App Step

Memoize the filtered product list.

Memoize product row callbacks.

Memoize repeated product row components only when stable props make it useful.

## What To Build

Add careful memoization:

```text
visibleProducts -> useMemo
row click handlers -> useCallback
ProductRow -> memo
```

Visible UI change:

```text
none expected
use console logs or React DevTools temporarily to observe render behavior
remove noisy debug UI/logging before committing unless you intentionally keep it as learning notes
```

## Build Steps

1. Wrap filtered product calculation in `useMemo`.
2. Include the correct dependencies.
3. Wrap product row action callbacks in `useCallback`.
4. Include the correct dependencies.
5. Wrap `ProductRow` in `memo`.
6. Check that `ProductRow` receives stable props.
7. Remove memoization if it makes the code less clear and no boundary benefits.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "perf(products): memoize filtered product list"
git push
```

## UI Target

Keep the same app screen. This lesson changes render behavior, not layout:

```text
same product list
same selected product panel
same filters
fewer unnecessary ProductRow renders when props stay the same
```

## Tailwind Classes To Preserve

Do not redesign in this lesson. Keep the existing classes.

If you add a temporary render counter for learning, use quiet styling:

```text
Debug Text: mt-1 text-xs text-slate-400
Debug Box: rounded-md border border-dashed border-slate-300 bg-slate-50 p-2 text-xs text-slate-500
```

## Suggested Shapes

```tsx
const visibleProducts = useMemo(() => {
  return filter === "all"
    ? products
    : products.filter((product) => product.reviewStatus === filter);
}, [products, filter]);
```

```tsx
const handleSelectProduct = useCallback((productId: string) => {
  dispatch({ type: "selected", productId });
}, [dispatch]);
```

## Common Mistakes

- Wrapping everything in `useMemo`.
- Using `useCallback` but still passing unstable object props.
- Missing dependencies.
- Using memoization to hide slow or messy code instead of fixing structure.

## Stop When You Can Explain

- Why `memo` can fail when props are unstable.
- Why `useMemo` is for values.
- Why `useCallback` is for function references.
- When memoization is not worth it.
