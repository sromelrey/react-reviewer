# 05 useEffect, Cleanup, And First API Call

[Back to React Study Plan](../README.md)

## Goal

Learn how React synchronizes with an external API.

By the end of this lesson, the app should load products from DummyJSON and show loading, error, empty, and success states.

## Big Words

### Big Word Alert: useEffect

`useEffect` runs after React renders.

Use it to synchronize React with something outside React, such as an API request.

### Big Word Alert: Dependency Array

The dependency array tells React when the effect should run again.

An empty dependency array means the effect runs after the first render.

### Big Word Alert: Loading State

Loading state represents async work that has started but has not finished.

### Big Word Alert: Error State

Error state represents async work that failed.

### Big Word Alert: AbortController

`AbortController` is a browser API that can cancel a fetch request.

### Conceptual Aside: API Data Is Outside React

React does not control the network.

An API request can be slow, fail, return empty data, or finish after a component unmounts.

That is why API loading needs explicit loading, error, empty, and cleanup handling.

## Sample API

Use DummyJSON Products:

```text
GET https://dummyjson.com/products?limit=5
GET https://dummyjson.com/products/1
```

Docs: [DummyJSON Products](https://dummyjson.com/docs/products)

## API Data Shape

DummyJSON returns products with fields like:

```ts
type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};
```

Your app should map that into its own shape:

```ts
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: "new" | "reviewed";
};
```

## App Step

Replace hard-coded products with API-loaded products.

Add local `reviewStatus` after mapping the API product into the app product shape.

## What To Build

Create the first real API loading flow:

```text
render -> show loading -> fetch products -> map data -> show products
```

Also handle:

```text
request fails -> show error
request succeeds with empty list -> show empty state
component unmounts -> abort fetch
```

Visible UI change:

```text
loading: skeleton blocks before products arrive
error: red message with retry button
empty: calm empty message
success: API products rendered as app product cards
```

## Build Steps

1. Create loading state.
2. Create error state.
3. Keep products in state.
4. Add `useEffect`.
5. Inside the effect, create an `AbortController`.
6. Fetch `https://dummyjson.com/products?limit=5`.
7. Check `response.ok`.
8. Convert API products to app products.
9. Add local `reviewStatus`.
10. Render loading, error, empty, and success UI.
11. Return cleanup that aborts the request.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "feat(api): load products from dummyjson"
git push
```

## UI Target

![API loading, error, and success states](../assets/05-api-loading-error-success.png)

Expected visible states:

```text
Loading products...
Unable to load products. [Retry]
No products found.
[Loaded product cards]
```

## Tailwind Classes To Reuse

```text
Loading Block: animate-pulse rounded-md bg-slate-100
Loading Card: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
Error Box: rounded-md border border-red-200 bg-red-50 p-3 text-red-700
Retry Button: rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700
Empty State: rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600
Success Row: flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4
Product Image: h-24 w-full rounded-md bg-slate-100 object-cover
```

## Suggested Effect Shape

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadProducts() {
    // fetch, map, set state
  }

  void loadProducts();

  return () => controller.abort();
}, []);
```

## Common Mistakes

- Making the effect callback itself `async`.
- Forgetting loading and error states.
- Updating state after an aborted request.
- Letting the whole app depend directly on the API response shape.
- Ignoring the empty state.

## Stop When You Can Explain

- Why API loading belongs in an Effect.
- Why loading and error states are separate.
- Why app data shape should not blindly depend on API shape.
- Why cleanup matters for fetch requests.
