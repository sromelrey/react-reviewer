# 05 useEffect, Cleanup, And First API Call

[Back to React Study Plan](../README.md)

## Goal

Synchronize the tracker with an external API.

By the end of this lesson, DummyJSON products should replace the hard-coded products, while the filters, reviewed count, selection, and details panel from lesson 04 continue to work.

## Big Words

### Big Word Alert: useEffect

`useEffect` runs after React commits a render. Use it to synchronize a component with a system outside React, such as the browser network API.

### Big Word Alert: Side Effect

A side effect is work that reaches outside rendering. Fetching data, starting a timer, and subscribing to browser events are side effects.

### Big Word Alert: Dependency Array

The dependency array lists values used by an Effect that can cause it to synchronize again. This lesson includes `requestVersion`, so clicking Retry starts a new request.

### Big Word Alert: Cleanup

Cleanup is the function returned by an Effect. React runs it before that Effect runs again and when the component unmounts.

### Big Word Alert: AbortController

`AbortController` is a browser API that cancels a `fetch` request through an `AbortSignal`.

### Big Word Alert: Data Mapping

Data mapping converts an external API shape into the shape owned by your app. It prevents DummyJSON field names from leaking through every component.

### Conceptual Aside: The Network Has More Than Two States

An API-backed screen is not only "data" or "no data." The request can be loading, failed, successful with no products, or successful with products. Model and render each state deliberately.

## Move And Extend The Product Model

Lesson 05 adds `imageUrl` because the API provides a thumbnail. Move the shared type out of `App.tsx` into `src/types/product.ts` so components and API code can import it without importing the `App` component:

```ts
export type ReviewStatus = "new" | "reviewed";
export type ProductFilter = "all" | ReviewStatus;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: ReviewStatus;
};
```

Add a temporary `imageUrl` to each hard-coded product before removing that array. This keeps TypeScript valid during the refactor.

Describe only the API fields this lesson reads:

```ts
type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: ApiProduct[];
};
```

## What To Build

```text
first render -> loading UI -> fetch -> map API products -> success UI
                                  -> failure -> error UI -> Retry
                                  -> empty array -> empty UI
cleanup -> abort unfinished request
```

The normal success screen remains the lesson 04 tracker:

```text
[Product Review Tracker]                         [Reviewed: 0/3]
[All] [New] [Reviewed]
[API product rows]                  [Selected Product Panel]
```

All API products begin with `reviewStatus: "new"`, so the first loaded summary is `Reviewed: 0/3`.

## Build Steps

1. Move `Product`, `ReviewStatus`, and `ProductFilter` to `src/types/product.ts`, add `imageUrl`, and update existing type imports.
2. Replace the constant product array with `products` state initialized to `[]`.
3. Add `isLoading`, `error`, and `requestVersion` state.
4. Change `selectedProductId` to `string | null`, initially `null`.
5. Add an Effect that depends on `requestVersion`.
6. Create an `AbortController` inside the Effect.
7. Fetch `https://dummyjson.com/products?limit=3` with its signal.
8. Check `response.ok` before reading JSON.
9. Map every `ApiProduct` into the app's `Product` type.
10. Store the mapped products and select the first loaded product.
11. Ignore `AbortError`, but store a readable message for real failures.
12. Return cleanup that aborts the current request.
13. Render loading, error, empty, and success branches.
14. Make Retry increment `requestVersion`.
15. Verify filters, count, row selection, and the details panel still work.

## Add The Loading Effect

```tsx
const [products, setProducts] = useState<Product[]>([]);
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [requestVersion, setRequestVersion] = useState(0);

useEffect(() => {
  const controller = new AbortController();

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://dummyjson.com/products?limit=3",
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      const nextProducts: Product[] = data.products.map((apiProduct) => ({
        id: String(apiProduct.id),
        name: apiProduct.title,
        description: apiProduct.description,
        price: apiProduct.price,
        imageUrl: apiProduct.thumbnail,
        reviewStatus: "new",
      }));

      setProducts(nextProducts);
      setSelectedProductId((currentId) =>
        nextProducts.some((product) => product.id === currentId)
          ? currentId
          : nextProducts[0]?.id ?? null,
      );
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load products.",
      );
      setProducts([]);
      setSelectedProductId(null);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  void loadProducts();

  return () => controller.abort();
}, [requestVersion]);
```

The Effect callback itself is not `async` because React expects it to return either nothing or a cleanup function, not a Promise.

## Add The Image To ProductRow

Keep the same props from lesson 04 and update the row JSX:

Because selection starts as `null` while the request loads, update the list contract too:

```tsx
type ProductListProps = {
  products: Product[];
  selectedProductId: string | null;
  onSelect: (productId: string) => void;
};
```

```tsx
<button
  type="button"
  className={rowClassName}
  aria-pressed={isSelected}
  onClick={() => onSelect(product.id)}
>
  <span className="flex min-w-0 items-center gap-4">
    <img
      className="h-16 w-16 shrink-0 rounded-md bg-slate-100 object-cover"
      src={product.imageUrl}
      alt=""
    />
    <span className="truncate text-lg font-semibold text-slate-950">
      {product.name}
    </span>
  </span>

  <ProductStatusBadge reviewStatus={product.reviewStatus} />
</button>
```

The empty `alt` is intentional because the adjacent product name already identifies the item. Repeating it would add noise for a screen reader.

## Render Every Request State

Create small components so `App` does not become one large conditional block.

```tsx
function ProductListSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-blue-700">Loading products...</p>

      {[0, 1, 2].map((item) => (
        <div key={item} className="flex animate-pulse items-center gap-4 py-2">
          <div className="h-16 w-16 rounded-md bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-slate-200" />
            <div className="h-3 w-28 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

type ProductLoadErrorProps = {
  message: string;
  onRetry: () => void;
};

function ProductLoadError({ message, onRetry }: ProductLoadErrorProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
      <p className="font-semibold">Failed to load products</p>
      <p className="mt-2 text-sm">{message}</p>
      <button
        type="button"
        className="mt-4 rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}
```

Choose exactly one main content branch:

```tsx
let productContent: ReactNode;

if (isLoading) {
  productContent = <ProductListSkeleton />;
} else if (error) {
  productContent = (
    <ProductLoadError
      message={error}
      onRetry={() => setRequestVersion((version) => version + 1)}
    />
  );
} else if (products.length === 0) {
  productContent = (
    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
      No products found.
    </p>
  );
} else {
  productContent = (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]">
      <ProductList
        products={visibleProducts}
        selectedProductId={selectedProductId}
        onSelect={setSelectedProductId}
      />
      <SelectedProductPanel product={selectedProduct} />
    </div>
  );
}
```

Import `type ReactNode` for the `productContent` variable:

```tsx
import { useEffect, useState, type ReactNode } from "react";
```

Render `{productContent}` below the existing header and filter tabs. Show the filter tabs only after loading succeeds, because there is nothing to filter during loading or failure.

## UI Target

![API loading, error, and success states](../assets/05-api-loading-error-success.png)

The image shows the states side by side for comparison. Your app displays one of them at a time.

The visual targets keep the familiar Keyboard, Mouse, and Monitor course fixtures so UI changes are easy to compare between lessons. A live DummyJSON response can return different product titles, prices, and thumbnails; match the documented layout and request states rather than the exact product text in the mockup.

## Git Checkpoint

Before coding:

```powershell
git status
```

After all four request states work:

```powershell
git status
git add .
git commit -m "feat(api): load products from dummyjson"
git push
```

## Common Mistakes

- Making the Effect callback itself `async`.
- Omitting `requestVersion` from the dependency array while expecting Retry to fetch again.
- Setting loading to false after an aborted request.
- Rendering the normal empty state while the request is still loading.
- Passing `ApiProduct` directly through the component tree.
- Keeping `selectedProductId` as `"keyboard"` after switching to numeric API IDs converted to strings.
- Leaving `ProductListProps.selectedProductId` as `string` after loading changes it to `string | null`.
- Forgetting that all API products start as `"new"`, so the initial reviewed count is zero.

## Stop When You Can Explain

- Why fetching is a side effect.
- Why an Effect callback should not be `async`.
- What the dependency array and cleanup each control.
- Why the API response is mapped into the app's `Product` type.
- Why Retry changes `requestVersion`.
- Why the target image shows separate UI states.
