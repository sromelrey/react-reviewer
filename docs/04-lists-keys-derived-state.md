# 04 Lists, Keys, And Derived State

[Back to React Study Plan](../README.md)

## Goal

Render collections safely and derive UI values from state.

By the end of this lesson, the app should render products with `.map`, filter by status, and show reviewed count.

## Big Words

### Big Word Alert: map

`.map` creates a new array by transforming each item.

In React, `.map` is commonly used to render a list of JSX elements.

### Big Word Alert: key

`key` is React's identity hint for list items.

It helps React match old and new list items during re-rendering.

### Big Word Alert: Derived State

Derived state is a value calculated from existing state or data.

If you can calculate it from current data, you usually should not store it separately.

### Conceptual Aside: Do Not Duplicate Truth

If `reviewedCount` can be calculated from `products`, then `products` is the source of truth.

Storing both can create bugs where one updates and the other does not.

## App Step

Render the product list from an array.

Add filters:

- All
- New
- Reviewed

Show reviewed count.

## What To Build

Replace manually repeated product cards with `.map`.

Add filter buttons:

```text
All
New
Reviewed
```

Show:

```text
Reviewed: 1/3
```

Visible UI change:

```text
header: reviewed count
toolbar: All / New / Reviewed filters
list: only products matching the active filter
empty state: message when no products match
```

## Build Steps

1. Add filter state: `"all" | "new" | "reviewed"`.
2. Create `visibleProducts` from `products` and the current filter.
3. Use `.map` to render `visibleProducts`.
4. Add `key={product.id}` to each rendered row/card.
5. Create `reviewedCount` from `products.filter(...)`.
6. Render reviewed count in the header.
7. Add filter buttons.
8. Apply active filter styling.
9. Confirm the selected product still works after filtering.

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

Expected visible structure:

```text
Product Review Tracker
Reviewed: 1/3
[All] [New] [Reviewed]
[Filtered product list]
[Selected Product Panel]
```

## Tailwind Classes To Reuse

```text
Filter Group: inline-flex overflow-hidden rounded-lg border border-slate-300
Active Filter: bg-blue-600 px-4 py-2 font-medium text-white
Inactive Filter: bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50
Product Row: flex items-center justify-between gap-4 border-b border-slate-200 p-4
Counter: rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-semibold
Empty State: rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600
```

## Suggested Derived Values

```tsx
const visibleProducts =
  filter === "all"
    ? products
    : products.filter((product) => product.reviewStatus === filter);

const reviewedCount = products.filter(
  (product) => product.reviewStatus === "reviewed",
).length;
```

## Common Mistakes

- Using array index as key for a list that can filter or reorder.
- Storing `reviewedCount` in state.
- Filtering the original data destructively.
- Forgetting to show an empty state when no products match the filter.

## Stop When You Can Explain

- Why `key` should be stable and unique.
- Why counts should be derived.
- Why array index keys are risky for reorderable lists.
- Why filtering should not mutate the original products array.
