# 08 Context API And Provider Hook

[Back to React Study Plan](../README.md)

## Goal

Remove the props chain without changing the Product Review Tracker UI.

By the end of this lesson, the reducer from lesson 07 lives in `ProductReviewProvider`, and components read shared state through `useProductReview()`.

## Starting Contract

Keep the data model already established by the API lesson:

```ts
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: "new" | "reviewed";
};

export type ProductFilter = "all" | Product["reviewStatus"];

export type ProductState = {
  products: Product[];
  selectedProductId: string | null;
  filter: ProductFilter;
  isLoading: boolean;
  error: string | null;
  requestVersion: number;
};
```

Reuse the `ProductState`, `ProductAction`, `initialProductState`, and `productReducer` created in lesson 07. Context changes how components reach that state; it must not create a second copy.

`error` and `requestVersion` deliberately keep their lesson 07 names. Context is a delivery refactor, so changing the reducer contract here would mix an unrelated data-model change into the lesson and would break Retry's Effect dependency.

## Big Words

### Big Word Alert: Context API

Context API is React's built-in way to make a value available to descendants without passing it through every component as props.

### Big Word Alert: Provider

A Provider is the component boundary that supplies a context value to everything rendered below it.

### Big Word Alert: Consumer

A consumer is a component or hook that reads the nearest matching Provider value.

"Nearest" matters when Providers are nested: React walks upward from the consumer and uses the first Provider for that context. In this app there is one `ProductReviewProvider` around `App`, so every tracker consumer shares the same reducer instance.

### Big Word Alert: Custom Provider Hook

A custom provider hook wraps `useContext` behind an app-specific function such as `useProductReview`. It gives consumers a clear API and a useful error when the Provider is missing.

### Conceptual Aside: Context Removes Plumbing, Not Ownership

The Provider becomes the owner of the reducer state. Context only changes the delivery route; actions, state transitions, and the difference between shared and local state still require deliberate decisions.

Keep temporary input state local to a form. Shared products, selection, filters, loading, and errors belong in product-review context.

## What To Build

```text
main.tsx
-> ProductReviewProvider owns useReducer
   -> App
      -> ReviewSummary reads context
      -> ProductWorkspace reads context
         -> FilterTabs reads context
         -> ProductList receives visible products
            -> ProductRow receives one product
         -> SelectedProductPanel reads context
```

Visible UI change:

```text
none
```

Selection, filters, reviewed count, loading/error states, product rows, and the selected-product panel must still look and behave exactly as they did in lesson 07.

## Files To Create Or Update

```text
src/
  context/ProductReviewContext.tsx
  App.tsx
  main.tsx
```

Keep your existing reducer and model files wherever you placed them. Adjust example import paths to match your project.

## Build Steps

1. Export the reducer types, `initialProductState`, and `productReducer` from the lesson 07 reducer file.
2. Create `ProductReviewContext.tsx`.
3. Type the context value as `{ state, dispatch }`.
4. Initialize the context with `undefined` so a missing Provider can be detected.
5. Move `useReducer(productReducer, initialProductState)` from `App` into `ProductReviewProvider`.
6. Render `children` inside the Provider.
7. Create `useProductReview()` and throw a clear error when the Provider is missing.
8. Wrap `<App />` with `<ProductReviewProvider>` in `main.tsx`.
9. Replace repeated state/action props with `useProductReview()` in components that need shared state.
10. Keep presentation props such as `product`, `isSelected`, and `onSelect` when a parent intentionally configures a reusable row.
11. Confirm every behavior still works before deleting old props.

## Create The Provider

```tsx
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  initialProductState,
  productReducer,
  type ProductAction,
  type ProductState,
} from "../state/productReducer";

type ProductReviewContextValue = {
  state: ProductState;
  dispatch: Dispatch<ProductAction>;
};

const ProductReviewContext = createContext<
  ProductReviewContextValue | undefined
>(undefined);

type ProductReviewProviderProps = {
  children: ReactNode;
};

export function ProductReviewProvider({
  children,
}: ProductReviewProviderProps) {
  const [state, dispatch] = useReducer(productReducer, initialProductState);

  return (
    <ProductReviewContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductReviewContext.Provider>
  );
}

export function useProductReview() {
  const context = useContext(ProductReviewContext);

  if (context === undefined) {
    throw new Error(
      "useProductReview must be used inside ProductReviewProvider",
    );
  }

  return context;
}
```

`Dispatch<ProductAction>` means consumers may dispatch only actions from the lesson 07 union. `ReactNode` describes anything React can render between `<ProductReviewProvider>` and `</ProductReviewProvider>` as `children`.

When reducer state changes, the Provider creates an updated `{ state, dispatch }` value and consumers that read this context render again. Context avoids manual forwarding; it does not make updates invisible or prevent rendering work.

`undefined` distinguishes "there is no Provider" from valid state such as an empty products array or `selectedProductId: null`.

Using a made-up default state would hide a missing Provider and let the screen run against data that is not connected to the real reducer. The `undefined` check fails immediately with a message that tells you exactly which boundary is missing.

The custom hook also gives components one app-specific entry point. They do not need to import the context object or repeat the missing-Provider check.

## Wrap The App

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ProductReviewProvider } from "./context/ProductReviewContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductReviewProvider>
      <App />
    </ProductReviewProvider>
  </StrictMode>,
);
```

The Provider must be above every component that calls `useProductReview()`. Calling the hook inside `App` works because `main.tsx` renders `App` as the Provider's child; calling it in `main.tsx` before returning the Provider would not.

## Preserve The API Effect

Moving the reducer does not turn Context into a data-fetching system. Keep the lesson 07 Effect at the top of `App`, read `state.requestVersion` and `dispatch` through the hook, and leave the request, cleanup, mapping, and actions unchanged:

```tsx
function App() {
  const { state, dispatch } = useProductReview();

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      dispatch({ type: "productsLoadStarted" });
      // Keep the lesson 07 fetch, mapping, and success/failure dispatches here.
    }

    void loadProducts();
    return () => controller.abort();
  }, [state.requestVersion, dispatch]);

  // Render the existing shell and request states.
}
```

React guarantees that a reducer's `dispatch` function has a stable identity, so including it in the dependency array does not cause repeated requests. The value that intentionally reruns this Effect is still `state.requestVersion`.

## Read Shared State In Real Components

Remove props only where Context now supplies the same shared feature value:

```text
ReviewSummary: remove reviewedCount and totalCount props; read products
FilterTabs: remove filter and onFilterChange props; read filter and dispatch
SelectedProductPanel: read selected product and dispatch productReviewed
ProductWorkspace: stop forwarding those shared values and actions
ProductList/ProductRow: keep explicit product, selection, and event presentation props
```

Make one component work at a time before deleting its old props. This keeps TypeScript errors local and lets you verify that the visible tracker remains unchanged after each move.

`ReviewSummary` no longer needs the products array passed through `App`:

```tsx
import { useProductReview } from "../context/ProductReviewContext";

export function ReviewSummary() {
  const {
    state: { products },
  } = useProductReview();

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

`FilterTabs` reads the current filter and dispatches the existing reducer action:

```tsx
import { useProductReview } from "../context/ProductReviewContext";
import type { ProductFilter } from "../types/product";

const filters: ProductFilter[] = ["all", "new", "reviewed"];

export function FilterTabs() {
  const {
    state: { filter },
    dispatch,
  } = useProductReview();

  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border border-slate-300"
      aria-label="Filter products by review status"
    >
      {filters.map((filterOption) => (
        <button
          key={filterOption}
          type="button"
          className={
            filter === filterOption
              ? "bg-blue-600 px-4 py-2 font-medium text-white"
              : "bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          }
          onClick={() =>
            dispatch({ type: "filterChanged", filter: filterOption })
          }
        >
          {filterOption}
        </button>
      ))}
    </div>
  );
}
```

`ReviewSummary` and `FilterTabs` consume shared feature state directly because intermediate components previously forwarded those values. `ProductRow` can still receive `product`, `isSelected`, and `onSelect` as props because those explicit presentation inputs make the row reusable and easy to inspect.

Context does not replace the reducer: Context delivers `{ state, dispatch }`, while the reducer still defines what every action means and calculates the next state. It also does not mean all state should become shared. A temporary text input used by only one form should remain local with `useState` until another component genuinely needs it.

## Preserve The App Shell

```tsx
function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-950">
      <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-normal">
              Product Review Tracker
            </h1>
            <p className="text-lg text-slate-600">
              Review API products and keep useful notes.
            </p>
          </div>
          <ReviewSummary />
        </header>

        <ProductWorkspace />
      </section>
    </main>
  );
}
```

## UI Target

![Context refactor preserves the reducer UI](../assets/07-reducer-review-action.png)

Context changes how components access state, not what the user sees. The screen must remain identical to the completed lesson 07 target.

- The summary remains right-aligned on desktop and wraps below the title on mobile.
- Filter buttons retain active and inactive styling.
- Selection still changes the blue selected row and details panel.
- Loading, error, empty, and success states still render.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "feat(state): add product review context provider"
git push
```

## Common Mistakes

- Creating provider state while leaving the old reducer state in `App`.
- Renaming `reviewStatus` to `status` and breaking existing components.
- Calling `useProductReview()` above the Provider.
- Moving temporary form drafts into Context.
- Removing useful presentation props just because Context exists.

## Stop When You Can Explain

- Which state the Provider owns.
- How `useProductReview()` finds the nearest Provider.
- Why the hook checks for `undefined`.
- Why Context removes prop plumbing but does not replace the reducer.
- Which state should remain local to a component.
