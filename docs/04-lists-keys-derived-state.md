# 04 Lists, Keys, And Derived State

[Back to React Study Plan](../README.md)

## Goal

Render collections safely and derive UI values from state.

## Learn

- `.map`.
- Stable `key`.
- Filtering.
- Derived state.
- Avoiding duplicated state.

## App Step

Render the product list from an array.

Add filters:

- All
- New
- Reviewed

Show reviewed count.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "feat(products): add status filters and reviewed count"
git push
```

## UI Target

![Selection, filters, and derived count](../assets/04-selection-filters-derived-state.png)

## Tailwind Classes To Reuse

```text
Filter Group: inline-flex overflow-hidden rounded-lg border border-slate-300
Active Filter: bg-blue-600 px-4 py-2 font-medium text-white
Inactive Filter: bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50
Product Row: flex items-center justify-between gap-4 border-b border-slate-200 p-4
Counter: rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-semibold
```

## Stop When You Can Explain

- Why `key` should be stable and unique.
- Why counts should be derived.
- Why array index keys are risky for reorderable lists.
