# 10 useMemo, useCallback, And memo

[Back to React Study Plan](../README.md)

## Goal

Understand memoization without overusing it.

## Learn

- `memo`.
- `useMemo`.
- `useCallback`.
- Referential equality.
- Stable props.
- When memoization is useful.

## App Step

Memoize the filtered product list.

Memoize product row callbacks.

Memoize repeated product row components only when stable props make it useful.

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

## Stop When You Can Explain

- Why `memo` can fail when props are unstable.
- Why `useMemo` is for values.
- Why `useCallback` is for function references.
