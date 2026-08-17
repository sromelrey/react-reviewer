# 12 Async UI And API Integration

[Back to React Study Plan](../README.md)

## Goal

Move from reading API data to changing API data safely.

By the end of this lesson, the selected product can be marked as reviewed through DummyJSON. The UI updates immediately, shows pending feedback, keeps the update on success, and rolls it back on failure.

## Starting Point

Keep the Product Review Tracker built in Lessons 01-11. This lesson does not replace its data model or move state out of `ProductReviewProvider`.

Your cumulative product shape should still look like this:

```ts
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: "new" | "reviewed";
  reviewNote?: string;
};
```

`reviewNote` is optional because a product loaded from the API may not have a saved note yet. Do not rename `name` back to DummyJSON's `title`, and do not change `id` back to a number. Lesson 05 already created the boundary between the API shape and the app shape.

Lesson 05 moved this type to `src/types/product.ts`. Keep importing it with `import type` so service, provider, component, and test files never import the `App` component just to obtain a type.

State ownership remains:

```text
ProductReviewProvider
-> owns products and reducer state
-> exposes state and markProductReviewed()
-> SelectedProductPanel renders the selected Product
-> ReviewMutationControls starts the mutation
```

## Big Words

### Big Word Alert: API Service

An API service is a module containing request functions such as `markProductReviewed`. It keeps URL, HTTP method, headers, and response checks out of UI components.

### Big Word Alert: Server State

Server state is data owned by an API, backend, or database. The React app can display a local copy and request changes, but the server remains the final source of truth.

### Big Word Alert: Mutation

A mutation is a request that changes server-owned data. A `PUT`, `PATCH`, `POST`, or `DELETE` request is commonly a mutation.

### Big Word Alert: Optimistic Update

An optimistic update changes the local UI before the server confirms the request. The tracker assumes the review request will succeed so the interface feels immediate.

### Big Word Alert: Rollback

A rollback restores the previous local value when an optimistic request fails.

### Big Word Alert: Pending State

Pending state means async work has started but has not settled. It prevents duplicate submissions and tells the user that the app is working.

### Conceptual Aside: Optimistic UI Is A Prediction

The optimistic `reviewed` badge is a prediction, not confirmed server truth. Keep the previous status until the request settles so failure can restore exactly what the user saw before.

## App Step

Add one focused flow to the selected product panel:

```text
click Mark reviewed
-> reducer applies reviewed status immediately
-> API request starts
-> success clears pending state
-> failure restores new status and shows Retry
```

Do not call `fetch` from `SelectedProductPanel`. The component starts an app action; the provider coordinates the reducer and API service.

## UI Target

![Final Product Review Tracker](../assets/final-product-review-tracker.png)

Keep the cumulative tracker layout:

```text
[Product Review Tracker]                    [Reviewed 1 of 3 products]
[All] [New] [Reviewed]                         [Search products]

[Product list]                              [Selected Product]
[cards/rows with images and badges]         [name, status, description, price]
                                            [review note form]
                                            [Mark reviewed]
```

Only the selected-product panel gains mutation feedback:

```text
new product       -> [Mark reviewed]
request pending   -> [Marking...] disabled
request succeeds  -> Reviewed status saved.
request fails     -> Could not mark product reviewed. [Retry]
```

The header summary and filters derive from `state.products`, while the Lesson 10 search query remains local to `ProductWorkspace`. All three controls continue updating the visible list.

## Build Steps

1. Confirm the shared `Product` type remains in `src/types/product.ts` and update any stale imports.
2. Update existing files to import `Product` with `import type`.
3. Create `src/services/productApi.ts`.
4. Add the `saveReviewedStatus(productId)` request function.
5. Add `reviewMutation` to `ProductState` and its initial state.
6. Extend `ProductAction` with started, confirmed, and rollback actions.
7. Handle those actions in `productReducer` without mutating the current state.
8. Add an async `markProductReviewed` action to `ProductReviewProvider`.
9. Expose that function from `useProductReview()` while keeping the provider as state owner.
10. Create `ReviewMutationControls`.
11. Render it inside the existing `SelectedProductPanel`, below the product information and review-note UI.
12. Confirm pending, success, error, retry, count, badge, and filter behavior.

## Step 1: Create The API Service

Create `src/services/productApi.ts`:

```ts
export async function saveReviewedStatus(productId: string): Promise<void> {
  const response = await fetch(
    `https://dummyjson.com/products/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewStatus: "reviewed" }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to mark product as reviewed.");
  }
}
```

DummyJSON simulates the update. A production backend would persist the status in a database.

## Step 2: Extend Reducer State

Add this focused async state to `ProductState`:

```ts
type ReviewMutationState = {
  productId: string | null;
  status: "idle" | "pending" | "error";
  error: string | null;
};

type ProductState = {
  products: Product[];
  selectedProductId: string | null;
  filter: ProductFilter;
  reviewMutation: ReviewMutationState;
  // Keep the loading/error fields already used by your product GET request.
};
```

Add `reviewMutation` to the existing initial state without removing its current fields:

```ts
reviewMutation: {
  productId: null,
  status: "idle",
  error: null,
},
```

## Step 3: Add Explicit Reducer Actions

Keep the actions from Lesson 07 and add these variants to `ProductAction`:

```ts
type ProductAction =
  // Keep selected, filterChanged, reviewed, reviewNoteChanged, and load actions.
  | { type: "reviewMutationStarted"; productId: string }
  | { type: "reviewMutationConfirmed"; productId: string }
  | {
      type: "reviewMutationRolledBack";
      productId: string;
      previousStatus: Product["reviewStatus"];
      message: string;
    };
```

Add the matching reducer cases:

```ts
case "reviewMutationStarted":
  return {
    ...state,
    products: state.products.map((product) =>
      product.id === action.productId
        ? { ...product, reviewStatus: "reviewed" }
        : product,
    ),
    reviewMutation: {
      productId: action.productId,
      status: "pending",
      error: null,
    },
  };

case "reviewMutationConfirmed":
  if (state.reviewMutation.productId !== action.productId) {
    return state;
  }

  return {
    ...state,
    reviewMutation: {
      productId: null,
      status: "idle",
      error: null,
    },
  };

case "reviewMutationRolledBack":
  return {
    ...state,
    products: state.products.map((product) =>
      product.id === action.productId
        ? { ...product, reviewStatus: action.previousStatus }
        : product,
    ),
    reviewMutation: {
      productId: action.productId,
      status: "error",
      error: action.message,
    },
  };
```

The reducer stays pure: it calculates next state but never performs the request.

## Step 4: Coordinate The Mutation In The Provider

Import the service into `ProductReviewProvider` and add this function beside the reducer:

```tsx
import { useCallback } from "react";
import { saveReviewedStatus } from "../services/productApi";

const markProductReviewed = useCallback(
  async (productId: string) => {
    const product = state.products.find((item) => item.id === productId);

    if (!product || product.reviewStatus === "reviewed") {
      return;
    }

    const previousStatus = product.reviewStatus;
    dispatch({ type: "reviewMutationStarted", productId });

    try {
      await saveReviewedStatus(productId);
      dispatch({ type: "reviewMutationConfirmed", productId });
    } catch {
      dispatch({
        type: "reviewMutationRolledBack",
        productId,
        previousStatus,
        message: "Could not mark product reviewed.",
      });
    }
  },
  [state.products],
);
```

Expose it in the existing context value and update the context type:

```tsx
type ProductReviewContextValue = {
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
  markProductReviewed: (productId: string) => Promise<void>;
};

<ProductReviewContext.Provider
  value={{ state, dispatch, markProductReviewed }}
>
  {children}
</ProductReviewContext.Provider>
```

### Conceptual Aside: The Reducer Does Not Perform Side Effects

The provider performs the request because network access is a side effect. The reducer only receives facts such as “started,” “confirmed,” or “rolled back” and returns the corresponding state.

## Step 5: Build The Styled Mutation Controls

Create `src/components/ReviewMutationControls.tsx`:

```tsx
import type { Product } from "../types/product";
import { useProductReview } from "../context/ProductReviewContext";

type ReviewMutationControlsProps = {
  product: Product;
};

export function ReviewMutationControls({
  product,
}: ReviewMutationControlsProps) {
  const { state, markProductReviewed } = useProductReview();
  const mutation = state.reviewMutation;
  const isCurrentProduct = mutation.productId === product.id;
  const isPending = isCurrentProduct && mutation.status === "pending";
  const hasError = isCurrentProduct && mutation.status === "error";

  return (
    <section className="mt-4 border-t border-slate-200 pt-4">
      <h3 className="text-sm font-semibold text-slate-950">
        Review status
      </h3>

      {hasError ? (
        <div
          className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          <p>{mutation.error}</p>
          <button
            type="button"
            className="mt-3 rounded-md border border-red-300 bg-white px-3 py-2 font-medium text-red-700 hover:bg-red-100"
            onClick={() => void markProductReviewed(product.id)}
          >
            Retry
          </button>
        </div>
      ) : isPending ? (
        <button
          type="button"
          className="mt-3 rounded-md bg-slate-300 px-4 py-2 font-medium text-white disabled:cursor-not-allowed"
          disabled
        >
          Marking...
        </button>
      ) : product.reviewStatus === "new" ? (
        <button
          type="button"
          className="mt-3 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          onClick={() => void markProductReviewed(product.id)}
        >
          Mark reviewed
        </button>
      ) : (
        <p
          className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700"
          role="status"
        >
          Reviewed status saved.
        </p>
      )}
    </section>
  );
}
```

The classes live in the actual JSX so the UI can be built directly from the lesson.

## Step 6: Add It To The Existing Details Panel

Keep the image, badge, description, price, and review-note form already in `SelectedProductPanel`. Add the controls after those elements:

```tsx
<aside
  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
  aria-labelledby="selected-product-heading"
>
  <p className="text-sm font-medium text-slate-500">Selected product</p>

  <div className="mt-3 flex items-start justify-between gap-3">
    <h2
      id="selected-product-heading"
      className="text-lg font-semibold text-slate-950"
    >
      {product.name}
    </h2>
    <ProductStatusBadge reviewStatus={product.reviewStatus} />
  </div>

  <img
    className="mt-4 h-40 w-full rounded-md bg-slate-100 object-cover"
    src={product.imageUrl}
    alt=""
  />
  <p className="mt-3 text-sm leading-6 text-slate-600">
    {product.description}
  </p>
  <p className="mt-4 text-lg font-bold text-slate-950">${product.price}</p>

  <ReviewNoteForm product={product} />
  <ReviewMutationControls product={product} />
</aside>
```

If your Lesson 09 component has a different name, keep that existing name. The important contract is that the note form and mutation controls receive the same selected `Product`; neither owns the products array.

## Manual Checks

1. Select a product with `reviewStatus: "new"`.
2. Click `Mark reviewed` once and confirm the button becomes `Marking...`.
3. Confirm the badge and header count update immediately.
4. Confirm the button cannot be clicked again while pending.
5. After success, confirm `Reviewed status saved.` appears.
6. Filter by `reviewed` and confirm the product remains visible.
7. Temporarily make the service throw an error.
8. Confirm the badge/count roll back and the error with `Retry` appears.
9. Restore the service and confirm retry succeeds.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "feat(api): add optimistic reviewed update"
git push
```

## Common Mistakes

- Calling the API inside the reducer.
- Using DummyJSON's numeric `id` in some components and the app's string `id` in others.
- Adding a second products array inside `ReviewMutationControls`.
- Removing the existing review-note form while adding mutation controls.
- Showing `Mark reviewed` while the same request is pending.
- Updating optimistically without storing enough information to roll back.
- Listing Tailwind classes without applying them to the rendered JSX.

## Stop When You Can Explain

- Which state belongs to `ProductReviewProvider` and which state belongs to the API.
- Why the reducer is pure even though the complete flow uses a network request.
- Why the UI changes before `saveReviewedStatus` resolves.
- How the previous status makes rollback possible.
- Why `ReviewMutationControls` receives one `Product`, not the whole products array.
