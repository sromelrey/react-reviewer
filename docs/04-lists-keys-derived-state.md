# 04 Lists, Keys, And Derived State

[Back to React Study Plan](../README.md)

## Goal

Render collections safely and calculate UI values from existing data.

By the end of this lesson, the tracker should render products with `.map`, filter them by review status, keep product selection working, and show a reviewed count.

## Big Words

### Big Word Alert: map

`.map` visits every item and returns a new array. In React, the new array usually contains JSX elements.

```tsx
products.map((product) => <ProductRow key={product.id} product={product} />)
```

The callback returns one JSX element for each product, so `.map` returns a new array
of JSX elements. It does not mutate `products`. React can render that returned array
as a list.

### Big Word Alert: key

`key` is React's identity hint for an item in a rendered list. React uses it during reconciliation to match an old item with the corresponding new item.

Use a stable ID from the data. Do not use the array index when items can be filtered, reordered, inserted, or removed.

An index describes a position, not the product at that position. After filtering or
reordering, index `0` may refer to a different product, so React can preserve local
DOM or component state against the wrong row. `product.id` continues to identify the
same product wherever it moves.

### Big Word Alert: Reconciliation

Reconciliation is React comparing the previous rendered tree with the next rendered tree to decide what needs to change in the DOM.

The `key` does not appear in the UI and is not passed as a normal prop. It helps React perform this comparison correctly.

### Big Word Alert: Derived State

Derived state is a value calculated from current state or props. `visibleProducts`, `reviewedCount`, and `selectedProduct` are derived values in this app.

### Conceptual Aside: Keep One Source Of Truth

If a value can be calculated from current data, usually calculate it during render instead of storing another state variable. Keeping both `products` and a separate `reviewedCount` in state creates two values that can disagree.

State is for information the app must remember after an interaction. Derived values
are answers computed from that remembered state and existing data. Here, the app
remembers `filter` and `selectedProductId`; it recalculates the visible rows, reviewed
count, and selected product.

### Conceptual Aside: Filtering Changes Visibility, Not Selection

The filter decides which rows are visible. Selection answers a separate question:
which product is active in the details panel. Hiding the selected row does not delete
the product or mean the user selected something else, so do not clear
`selectedProductId` when `filter` changes.

The reviewed summary also describes the full collection. Calculate it from
`products`, while `visibleProducts` is used only for the filtered list.

## Starting Point

Continue from lesson 03 with this product shape:

```ts
type ReviewStatus = "new" | "reviewed";
type ProductFilter = "all" | ReviewStatus;

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  reviewStatus: ReviewStatus;
};
```

Keep the same three products and keep `selectedProductId` in `App`:

```tsx
const [selectedProductId, setSelectedProductId] = useState("keyboard");
const [filter, setFilter] = useState<ProductFilter>("all");
```

## What To Build

This lesson changes the card area into the list layout shown in the target image:

```text
[Product Review Tracker]                         [Reviewed: 1/3]
[All] [New] [Reviewed]

[Filtered selectable product rows]  [Selected Product Panel]
```

The selected row gets a blue border and background. Filtering the list must not erase the selected product; the details panel can continue showing it even when its row is hidden by the active filter.

Create or update these components:

```text
App
-> ReviewSummary
-> FilterTabs
-> ProductList
   -> ProductRow
      -> ProductStatusBadge
-> SelectedProductPanel
   -> ProductStatusBadge
```

## Build Steps

1. Add the `ReviewStatus` and `ProductFilter` types.
2. Add `filter` state to `App`, initially set to `"all"`.
3. Derive `visibleProducts` from `products` and `filter`.
4. Derive `reviewedCount` from the full `products` array, not `visibleProducts`.
5. Continue deriving `selectedProduct` from `products` and `selectedProductId`.
6. Create `FilterTabs` and pass `filter` plus `onFilterChange`.
7. Replace the three-card grid with `ProductList`.
8. In `ProductList`, render `ProductRow` with `.map` and `key={product.id}`.
9. Pass `isSelected` and `onSelect` to each row.
10. Render the empty state when `visibleProducts.length === 0`.
11. Confirm selection, filters, count, and details all still work.

## Derive The Values

These are ordinary variables recalculated on every render. They are not additional state:

```tsx
const visibleProducts =
  filter === "all"
    ? products
    : products.filter((product) => product.reviewStatus === filter);

const reviewedCount = products.filter(
  (product) => product.reviewStatus === "reviewed",
).length;

const selectedProduct = products.find(
  (product) => product.id === selectedProductId,
);
```

## Build FilterTabs

```tsx
type FilterTabsProps = {
  filter: ProductFilter;
  onFilterChange: (filter: ProductFilter) => void;
};

const filters: ProductFilter[] = ["all", "new", "reviewed"];

function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border border-slate-300"
      aria-label="Filter products by review status"
    >
      {filters.map((filterOption) => {
        const isActive = filterOption === filter;

        return (
          <button
            key={filterOption}
            type="button"
            className={
              isActive
                ? "bg-blue-600 px-4 py-2 font-medium capitalize text-white"
                : "bg-white px-4 py-2 font-medium capitalize text-slate-700 hover:bg-slate-50"
            }
            aria-pressed={isActive}
            onClick={() => onFilterChange(filterOption)}
          >
            {filterOption}
          </button>
        );
      })}
    </div>
  );
}
```

`aria-pressed` communicates which toggle button is active to assistive technology. The closure in `onClick` remembers the current `filterOption`.

Each filter button also uses `filterOption` as its key. Those three string values are
stable identities, just like product IDs are stable identities for product rows.

## Build ProductList And ProductRow

`ProductList` owns no state. It receives the already filtered products and describes how to render them.

```tsx
type ProductListProps = {
  products: Product[];
  selectedProductId: string;
  onSelect: (productId: string) => void;
};

function ProductList({ products, selectedProductId, onSelect }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
        No products match this filter.
      </p>
    );
  }

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          isSelected={product.id === selectedProductId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
```

`ProductRow` replaces the lesson 03 card layout so the UI matches the target image. Keep the product description and price in `SelectedProductPanel`.

```tsx
type ProductRowProps = {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string) => void;
};

function ProductRow({ product, isSelected, onSelect }: ProductRowProps) {
  const rowClassName = isSelected
    ? "flex w-full items-center justify-between gap-4 border-l-4 border-blue-600 bg-blue-50 p-4 text-left"
    : "flex w-full items-center justify-between gap-4 border-l-4 border-transparent bg-white p-4 text-left hover:bg-slate-50";

  return (
    <button
      type="button"
      className={rowClassName}
      aria-pressed={isSelected}
      onClick={() => onSelect(product.id)}
    >
      <span className="flex min-w-0 items-center gap-4">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xl font-bold text-slate-500"
          aria-hidden="true"
        >
          {product.name.charAt(0)}
        </span>
        <span className="truncate text-lg font-semibold text-slate-950">
          {product.name}
        </span>
      </span>

      <ProductStatusBadge reviewStatus={product.reviewStatus} />
    </button>
  );
}
```

## Connect The UI In App

Use the same styled header and `SelectedProductPanel` from lessons 02 and 03:

```tsx
<header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-slate-950">
      Product Review Tracker
    </h1>
    <p className="text-lg text-slate-600">Review products by status</p>
  </div>

  <ReviewSummary reviewedCount={reviewedCount} totalCount={products.length} />
</header>

<div className="mt-6">
  <FilterTabs filter={filter} onFilterChange={setFilter} />
</div>

<div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]">
  <ProductList
    products={visibleProducts}
    selectedProductId={selectedProductId}
    onSelect={setSelectedProductId}
  />

  <SelectedProductPanel product={selectedProduct} />
</div>
```

Update `ReviewSummary` to receive the values it displays:

```tsx
type ReviewSummaryProps = {
  reviewedCount: number;
  totalCount: number;
};

function ReviewSummary({ reviewedCount, totalCount }: ReviewSummaryProps) {
  return (
    <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700">
      Reviewed: {reviewedCount}/{totalCount}
    </p>
  );
}
```

## UI Target

![Selection, filters, and derived count](../assets/04-selection-filters-derived-state.png)

Use the letter tile as the row's image placeholder in this lesson. Lesson 05 replaces it with the real API thumbnail, so you do not need to add `imageUrl` early.

## Git Checkpoint

Before coding:

```powershell
git status
```

After the filters, list, count, and selection all work:

```powershell
git status
git add .
git commit -m "feat(products): add status filters and derived count"
git push
```

## Common Mistakes

- Using the array index as `key` when the list can be filtered.
- Expecting `key` to arrive inside `ProductRow` as a normal prop.
- Storing `visibleProducts`, `reviewedCount`, or `selectedProduct` in state.
- Calculating the reviewed total from `visibleProducts`, which makes the total change with the filter.
- Clearing `selectedProductId` when a filter merely hides its row.
- Mutating the original products array.

## Stop When You Can Explain

- How `.map` turns data into JSX.
- Why `product.id` is a better key than the array index.
- How keys help reconciliation.
- Why the three derived values do not need their own state.
- Why filtering the list does not need to clear the selected product.
