# 02 Props And Component Composition

[Back to React Study Plan](../README.md)

## Goal

Learn how data moves from parent components to child components.

By the end of this lesson, your static product cards should be split into reusable components.

You will also add one small visible summary line so the new `ReviewSummary` component has a clear job on the screen.

## Big Words

### Big Word Alert: Props

Props are values passed from a parent component to a child component.

Props are read-only from the child component's point of view.

### Big Word Alert: Component Composition

Component composition means building a UI by combining smaller components.

Instead of one large `App` function, you create smaller pieces that each have a clear job.

### Big Word Alert: children

`children` is a special prop for nested JSX.

Use it when a component should wrap content that is passed between its opening and closing tags.

### Big Word Alert: Summary Component

A summary component shows a small calculated overview of the data.

In this lesson, `ReviewSummary` receives the `products` array and shows how many products are reviewed out of the total.

### Conceptual Aside: Why Refactor

Lesson 01 kept everything in one file so you could see the whole UI.

Now we refactor because repeated UI becomes easier to understand when each piece has a name.

Refactoring should not change behavior. It changes structure.

In this lesson, the cards should keep the same data and styling from lesson 01. The only new visible UI is the small summary line, because `ReviewSummary` needs something real to render.

## What To Build

Refactor the static product cards from lesson 01.

Add this small summary above the product cards:

```text
Reviewed 1 of 3 products
```

Create these components inside `App.tsx` first:

```text
ProductCard
ProductStatusBadge
ReviewSummary
```

Do not create separate files yet unless you feel comfortable.

The product cards should still look like lesson 01. The summary line is the only new UI.

## App Step

Refactor the one-file static UI into small components:

- `ProductCard`
- `ProductStatusBadge`
- `ReviewSummary`

The component relationship should feel like this:

```text
App
-> ReviewSummary
-> ProductCard
   -> ProductStatusBadge
```

## Build Steps

1. Keep the `Product` type and `products` array in `App.tsx`.
2. Create a `ProductStatusBadge` component.
3. Pass `reviewStatus` as a prop.
4. Move the badge Tailwind classes into `ProductStatusBadge`.
5. Create a `ProductCard` component.
6. Pass one `product` object as a prop.
7. Move one card's JSX into `ProductCard`.
8. Use `ProductStatusBadge` inside `ProductCard`.
9. Create a `ReviewSummary` component.
10. Pass the `products` array into `ReviewSummary`.
11. Inside `ReviewSummary`, calculate how many products have `reviewStatus === "reviewed"`.
12. Render the summary above the card grid.
13. Keep the product cards visually the same as lesson 01.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "refactor(products): split product card components"
git push
```

## UI Target

Use the same card design from lesson 01, but split the UI into components and add the summary line above the card grid:

![Static product cards](../assets/01-static-product-cards.png)

Expected visible structure:

```text
Product Review Tracker
Static product cards
Reviewed 1 of 3 products
[Keyboard card] [Mouse card] [Monitor card]
```

## Suggested Component Shape

```tsx
type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <article>
      <h2>{product.name}</h2>
      <ProductStatusBadge reviewStatus={product.reviewStatus} />
    </article>
  );
}
```

Create `ProductStatusBadge` so `ProductCard` does not need to know the badge classes:

```tsx
type ProductStatusBadgeProps = {
  reviewStatus: Product["reviewStatus"];
};

function ProductStatusBadge({ reviewStatus }: ProductStatusBadgeProps) {
  const badgeClassName =
    reviewStatus === "new"
      ? "rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700"
      : "rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700";

  return <span className={badgeClassName}>{reviewStatus}</span>;
}
```

Create `ReviewSummary` so `App` has a named place for the overview:

```tsx
type ReviewSummaryProps = {
  products: Product[];
};

function ReviewSummary({ products }: ReviewSummaryProps) {
  const reviewedCount = products.filter(
    (product) => product.reviewStatus === "reviewed",
  ).length;

  return (
    <p className="mt-4 text-sm font-medium text-slate-700">
      Reviewed {reviewedCount} of {products.length} products
    </p>
  );
}
```

Then `App` should use the extracted components:

```tsx
<ReviewSummary products={products} />

<div className="grid gap-4 md:grid-cols-3">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Common Mistakes

- Mutating props inside a child component.
- Creating too many components before the UI repeats.
- Passing vague props like `data` instead of clear props like `product`.
- Changing behavior while trying to refactor.
- Typing a component as `Product[]` instead of a props object like `{ products: Product[] }`.
- Forgetting that `Product["reviewStatus"]` is the property value type, not the whole props object.

## Stop When You Can Explain

- Why props are read-only.
- When to create a child component.
- What `children` is for.
- Why refactoring should preserve behavior.
- Why `ReviewSummary` receives `products` instead of reading the array from inside the component.
- Why `ProductStatusBadge` receives only `reviewStatus` instead of the whole product.
