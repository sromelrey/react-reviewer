# 02 Props And Component Composition

[Back to React Study Plan](../README.md)

## Goal

Learn how data moves from parent components to child components.

By the end of this lesson, your static product cards should be split into reusable components.

You will also add one small visible summary badge in the header row so the new `ReviewSummary` component has a clear job on the screen.

## Big Words

### Big Word Alert: Props

Props are values passed from a parent component to a child component.

Props are read-only from the child component's point of view.

React uses one-way data flow: the parent owns a value and passes it down. A child
must not mutate that value because the parent would no longer be the reliable source
of truth. To request a change later, a child receives and calls a callback prop.

Props are always received as one object. Type that object, even when the component
needs only one value:

```tsx
type ProductStatusBadgeProps = {
  reviewStatus: Product["reviewStatus"];
};

function ProductStatusBadge({ reviewStatus }: ProductStatusBadgeProps) {
  return <span>{reviewStatus}</span>;
}
```

`Product["reviewStatus"]` extracts the property's value type (`"new" |
"reviewed"`). It is not a props object by itself.

### Big Word Alert: Component Composition

Component composition means building a UI by combining smaller components.

Instead of one large `App` function, you create smaller pieces that each have a clear job.

### Big Word Alert: children

`children` is a special prop for nested JSX.

Use it when a component should wrap content that is passed between its opening and closing tags.

```tsx
type SectionProps = {
  children: React.ReactNode;
};

function Section({ children }: SectionProps) {
  return <section className="rounded-lg border p-4">{children}</section>;
}

// The heading becomes this Section instance's children.
<Section><h2>Products</h2></Section>
```

The Product Review Tracker does not need this wrapper yet because its components
have specific jobs and named props. Use `children` when the caller should choose the
nested content, not merely because a component has JSX inside it.

### Big Word Alert: Summary Component

A summary component shows a small calculated overview of the data.

In this lesson, `ReviewSummary` receives the `products` array and shows how many products are reviewed out of the total. It sits on the right side of the header row beside the title area.

### Conceptual Aside: Why Refactor

Lesson 01 kept everything in one file so you could see the whole UI.

Now we refactor because repeated UI becomes easier to understand when each piece has a name.

Refactoring should not change behavior. It changes structure.

In this lesson, the cards should keep the same data and styling from lesson 01. The only new visible UI is the small header summary badge, because `ReviewSummary` needs something real to render.

Create a component when a UI piece repeats, has a clear responsibility, or would be
easier to understand and test with a name. `ProductStatusBadge` owns status styling,
`ProductCard` owns one card, and `ReviewSummary` owns the page-level count.

### Conceptual Aside: Data Ownership And Narrow Props

`App` owns the product collection, so it passes that collection to
`ReviewSummary`. Reading a module variable directly would hide the dependency and
make the component harder to reuse with different products.

Pass each child only what its job requires. `ProductStatusBadge` needs one status,
not the full product. `ReviewSummary` needs the collection to calculate a page-level
overview, and it belongs beside the page title because it summarizes the whole page,
not one card.

## What To Build

Refactor the static product cards from lesson 01.

Add this small summary in the header row:

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

The product cards should still look like lesson 01. The header summary badge is the only new UI.

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
12. Render the summary inside the header row, aligned with the title/subtitle area.
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

Use the same card design from lesson 01, but split the UI into components and add the summary badge to the header row:

![Static product cards](../assets/01-static-product-cards.png)

Expected visible structure:

```text
[Product Review Tracker / Static product cards]          [Reviewed 1 of 3 products]
[Keyboard card] [Mouse card] [Monitor card]
```

On mobile, it is okay if the summary wraps below the title. On desktop, keep it aligned to the right side of the header row.

## Tailwind Classes To Reuse

```text
Header Row: flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between
Title Group: space-y-2
Summary Badge: rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700
Card Grid: mt-6 grid gap-4 md:grid-cols-3
```

## Suggested Component Shape

```tsx
type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-950">
          {product.name}
        </h2>

        <ProductStatusBadge reviewStatus={product.reviewStatus} />
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {product.description}
      </p>

      <p className="mt-4 text-lg font-bold text-slate-950">
        ${product.price}
      </p>
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
    <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
      Reviewed {reviewedCount} of {products.length} products
    </p>
  );
}
```

Then `App` should use the extracted components with `ReviewSummary` in the header row:

```tsx
<header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
  <div className="space-y-2">
    <h1 className="text-3xl font-bold tracking-normal text-slate-950">
      Product Review Tracker
    </h1>
    <p className="text-lg text-slate-600">Static product cards</p>
  </div>

  <ReviewSummary products={products} />
</header>

<div className="mt-6 grid gap-4 md:grid-cols-3">
  <ProductCard product={products[0]} />
  <ProductCard product={products[1]} />
  <ProductCard product={products[2]} />
</div>
```

The cards remain explicit for now so this lesson stays focused on props and
composition. Lesson 04 replaces these repeated calls with `.map` and explains keys.

## Common Mistakes

- Mutating props inside a child component.
- Creating too many components before the UI repeats.
- Passing vague props like `data` instead of clear props like `product`.
- Changing behavior while trying to refactor.
- Typing a component as `Product[]` instead of a props object like `{ products: Product[] }`.
- Forgetting that `Product["reviewStatus"]` is the property value type, not the whole props object.
- Rendering `ReviewSummary` in a random place instead of the header row where the overview belongs.

## Stop When You Can Explain

- Why props are read-only.
- When to create a child component.
- What `children` is for.
- Why refactoring should preserve behavior.
- Why `ReviewSummary` receives `products` instead of reading the array from inside the component.
- Why `ReviewSummary` belongs beside the page title instead of inside each product card.
- Why `ProductStatusBadge` receives only `reviewStatus` instead of the whole product.
