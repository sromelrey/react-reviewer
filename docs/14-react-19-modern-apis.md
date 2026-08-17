# 14 React 19 Modern APIs

[Back to React Study Plan](../README.md)

## Goal

Use React 19 APIs after understanding the manual async flow they simplify.

By the end of this lesson, the selected product keeps the same Product Review Tracker UI, but its `Mark reviewed` flow uses a form Action, `useActionState`, `useFormStatus`, and `useOptimistic`.

## Starting Point

Keep every cumulative feature from Lessons 01-13:

```text
Product list loaded from DummyJSON
selection and selected-product details
all/new/reviewed filters
derived reviewed summary
review note form and validation
ProductReviewProvider and productReducer
behavior tests
```

The data contract does not change:

```ts
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: "new" | "reviewed";
  reviewNote?: string;
};
```

This lesson changes only the review-status mutation controls. Do not rewrite API loading, filters, selection, context, or the review-note form.

## Big Words

### Big Word Alert: Action

An Action is a function used in a transition to perform work and update UI around an interaction. A form can receive an Action through its `action` prop.

### Big Word Alert: `useActionState`

`useActionState` runs an Action and stores the value returned by its latest execution. It is useful for result data such as a validation or server error.

### Big Word Alert: `useFormStatus`

`useFormStatus` reads the submission state of the nearest parent `<form>`. A child submit button can use it to disable itself and display pending text.

### Big Word Alert: `useOptimistic`

`useOptimistic` displays a temporary value while an Action is pending. If the Action fails, React returns to the current real value supplied by props or state.

### Big Word Alert: `use`

`use` reads a resource such as Context or a Suspense-compatible Promise during rendering. Unlike ordinary Hooks, `use` may be called in a loop or conditional, but it must still run inside a component or Hook.

### Big Word Alert: Transition

A transition marks an update as work React can coordinate without blocking urgent interactions. Form Actions automatically run their updates in a transition.

### Big Word Alert: Progressive Enhancement

Progressive enhancement means a form retains useful submission behavior even before or without all client JavaScript behavior. Action-based forms are designed around the browser's form model.

### Conceptual Aside: Modern APIs Compress A Flow You Already Know

Lesson 12 manually tracked pending state, optimistic state, errors, and rollback. React 19 does not remove those ideas; it gives them a more direct form-based structure.

## Manual Flow And React 19 Flow

| Lesson 12 | React 19 replacement |
| --- | --- |
| click handler calls async provider function | `<form action={formAction}>` |
| reducer stores pending status | `useFormStatus()` |
| reducer applies temporary reviewed value | `useOptimistic()` |
| reducer stores mutation error | `useActionState()` return value |
| rollback action restores old status | optimistic value reverts when Action fails |

The real confirmed `reviewStatus` still belongs to `ProductReviewProvider`. React's optimistic value is temporary display state, not a second products array.

## UI Target

![React 19 preserves the final tracker layout](../assets/final-product-review-tracker.png)

The layout stays cumulative:

```text
[Product Review Tracker]                    [Reviewed 1 of 3 products]
[All] [New] [Reviewed]                         [Search products]

[Product list]                              [Selected Product]
                                            [name and status badge]
                                            [description and price]
                                            [review note form]
                                            [Mark reviewed]
```

During the modern Action:

```text
click Mark reviewed
-> badge updates optimistically
-> button reads Marking... and is disabled
-> success commits real product state and updates the summary
-> failure restores new status and displays an alert
```

## Build Steps

1. Confirm the project uses React 19 before importing these APIs.
2. Keep `saveReviewedStatus(productId)` from Lesson 12.
3. Keep the existing final `reviewed` reducer action from Lesson 07.
4. Create `useReviewAction(product)` with `useActionState` and `useOptimistic`.
5. Create `ReviewSubmitButton` with `useFormStatus`.
6. Create `ReviewActionForm` and pass the Action to its `<form>`.
7. Use the optimistic status in the selected product badge.
8. Replace only `ReviewMutationControls` in `SelectedProductPanel`.
9. Key the modern content by product ID so stale result messages do not move between products.
10. Re-run the Lesson 13 tests and manually check pending, success, and failure.

## Step 1: Keep One Confirmed Reducer Action

The API call remains outside the reducer. Keep or add the final `reviewed` case introduced earlier in the course:

```ts
type ProductAction =
  // Keep every existing action.
  | { type: "reviewed"; productId: string };

case "reviewed":
  return {
    ...state,
    products: state.products.map((product) =>
      product.id === action.productId
        ? { ...product, reviewStatus: "reviewed" }
        : product,
    ),
  };
```

In this lesson, `reviewed` runs after the API succeeds. `useOptimistic` handles the temporary status before confirmation.

## Step 2: Create The Action State And Hook

Create `src/hooks/useReviewAction.ts`:

```tsx
import { useActionState, useOptimistic } from "react";
import { saveReviewedStatus } from "../services/productApi";
import { useProductReview } from "../context/ProductReviewContext";
import type { Product } from "../types/product";

type ReviewActionState = {
  error: string | null;
};

const initialActionState: ReviewActionState = {
  error: null,
};

export function useReviewAction(product: Product) {
  const { dispatch } = useProductReview();
  const [optimisticStatus, setOptimisticStatus] =
    useOptimistic<Product["reviewStatus"]>(product.reviewStatus);

  async function reviewAction(
    _previousState: ReviewActionState,
    formData: FormData,
  ): Promise<ReviewActionState> {
    const productId = String(formData.get("productId"));

    if (productId !== product.id) {
      return { error: "The selected product changed. Please try again." };
    }

    setOptimisticStatus("reviewed");

    try {
      await saveReviewedStatus(productId);
      dispatch({ type: "reviewed", productId });
      return { error: null };
    } catch {
      return { error: "Could not mark product reviewed." };
    }
  }

  const [actionState, formAction] = useActionState(
    reviewAction,
    initialActionState,
  );

  return { actionState, formAction, optimisticStatus };
}
```

The hook returns three different concerns:

```text
optimisticStatus -> what the badge should show now
formAction       -> what the form submits
actionState      -> the latest error returned by the Action
```

### Conceptual Aside: Optimistic State Is Derived Display State

`optimisticStatus` temporarily shadows `product.reviewStatus`; it does not edit the product object. After success, `dispatch({ type: "reviewed" })` updates the real provider state. After failure, no confirmed dispatch occurs, so React shows the original status again.

One consequence is important: only the selected panel's badge is optimistic in this focused refactor. The global summary changes after confirmation because its source remains the real provider state. Making the entire list and summary optimistic would require lifting the optimistic products array to their shared owner.

## Step 3: Read Pending State Inside The Form

Create `src/components/ReviewSubmitButton.tsx`:

```tsx
import { useFormStatus } from "react-dom";

type ReviewSubmitButtonProps = {
  isReviewed: boolean;
};

export function ReviewSubmitButton({
  isReviewed,
}: ReviewSubmitButtonProps) {
  const { pending } = useFormStatus();

  if (isReviewed && !pending) {
    return (
      <p
        className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700"
        role="status"
      >
        Reviewed status saved.
      </p>
    );
  }

  return (
    <button
      type="submit"
      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      disabled={pending}
    >
      {pending ? "Marking..." : "Mark reviewed"}
    </button>
  );
}
```

`useFormStatus` must be inside a component rendered beneath the `<form>`. Calling it in the component that creates the form reads no parent form submission.

## Step 4: Build The Styled Action Form

Create `src/components/ReviewActionForm.tsx`:

```tsx
import type { Product } from "../types/product";

type ReviewActionState = {
  error: string | null;
};

type ReviewActionFormProps = {
  product: Product;
  actionState: ReviewActionState;
  formAction: (formData: FormData) => void;
  optimisticStatus: Product["reviewStatus"];
};

export function ReviewActionForm({
  product,
  actionState,
  formAction,
  optimisticStatus,
}: ReviewActionFormProps) {
  return (
    <form
      action={formAction}
      className="mt-4 space-y-3 border-t border-slate-200 pt-4"
    >
      <input type="hidden" name="productId" value={product.id} />

      <h3 className="text-sm font-semibold text-slate-950">
        Review status
      </h3>

      {actionState.error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {actionState.error}
        </p>
      ) : null}

      <ReviewSubmitButton
        isReviewed={optimisticStatus === "reviewed"}
      />
    </form>
  );
}
```

The hidden input lets the browser's `FormData` carry the product ID into the Action. It does not create another source of state.

## Step 5: Integrate With SelectedProductPanel

Use the hook once near the top of the selected-product content:

```tsx
function SelectedProductContent({ product }: { product: Product }) {
  const { actionState, formAction, optimisticStatus } =
    useReviewAction(product);

  return (
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
        <ProductStatusBadge reviewStatus={optimisticStatus} />
      </div>

      <img
        className="mt-4 h-40 w-full rounded-md bg-slate-100 object-cover"
        src={product.imageUrl}
        alt=""
      />
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {product.description}
      </p>
      <p className="mt-4 text-lg font-bold text-slate-950">
        ${product.price}
      </p>

      <ReviewNoteForm product={product} />
      <ReviewActionForm
        product={product}
        actionState={actionState}
        formAction={formAction}
        optimisticStatus={optimisticStatus}
      />
    </aside>
  );
}
```

Keep the empty-selection branch in the parent `SelectedProductPanel`. Render the content with a key:

```tsx
if (!product) {
  return (
    <aside className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
      Select a product to view details.
    </aside>
  );
}

return <SelectedProductContent key={product.id} product={product} />;
```

The `key` resets Action result state when selection changes. Here, the key has a deliberate state-reset purpose; it is not only for list rendering.

## Where `use` Fits

The tracker should continue using `useProductReview()` because its missing-provider error is useful. React 19's `use` can read the same exported context when conditional access is genuinely helpful:

For this optional comparison only, export `ProductReviewContext` from the provider file. If you skip the comparison component, keep the context private and continue using `useProductReview()`.

```tsx
import { use } from "react";
import { ProductReviewContext } from "../context/ProductReviewContext";

function OptionalProductCount({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  const context = use(ProductReviewContext);

  if (!context) {
    throw new Error("OptionalProductCount requires ProductReviewProvider");
  }

  return (
    <p className="text-sm font-medium text-slate-600">
      {context.state.products.length} products loaded
    </p>
  );
}
```

This demonstrates the conditional rule difference. Do not add `OptionalProductCount` to the final UI unless it provides real information the existing summary does not already show.

`use(promise)` is a separate Suspense-based reading pattern. Do not replace the Lesson 05 client-side Effect with a freshly created Promise during render; unstable Promises can restart work and produce confusing behavior.

## Update The Lesson 13 Expectations

The user-visible names stay the same, so the behavior tests should still query:

```tsx
screen.getByRole("button", { name: "Mark reviewed" });
screen.findByText("Reviewed 1 of 3 products");
screen.findByText("Reviewed status saved.");
screen.findByRole("alert");
```

The fetch mock still observes the same `PUT /products/:id` request. If the failure test previously expected a `Retry` button, update that assertion: submitting `Mark reviewed` again is now the retry because the Action form returns after the optimistic value reverts.

## Manual Checks

1. Select a new product.
2. Submit `Mark reviewed`.
3. Confirm the badge changes immediately while the button displays `Marking...`.
4. Confirm the summary changes after the server response is confirmed.
5. Confirm success leaves the product reviewed.
6. Force `saveReviewedStatus` to throw.
7. Confirm the badge returns to `new` and the alert appears.
8. Submit again and confirm retry works.
9. Change selected products and confirm the previous product's error does not appear in the next panel.
10. Confirm the review-note form still works independently.
11. Run the complete behavior test suite.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "refactor(react): use action-based review mutation"
git push
```

## Common Mistakes

- Calling `useFormStatus` in the same component that creates the `<form>`.
- Dispatching `reviewed` before the API succeeds while also using `useOptimistic`.
- Expecting a component-local optimistic status to update the global summary before confirmation.
- Removing `ProductReviewProvider` and creating a second products array.
- Nesting the status Action form inside the review-note form.
- Forgetting the hidden `productId` field.
- Treating optimistic status as confirmed server state.
- Creating a Promise during every render and passing it to `use`.
- Replacing the entire tracker just to demonstrate one modern API.
- Dropping Tailwind classes from JSX during the refactor.

## Stop When You Can Explain

- What `useActionState` stores and what it does not store.
- Why `useFormStatus` belongs in `ReviewSubmitButton`.
- Why `useOptimistic` can replace the manual rollback display flow.
- When the provider receives the confirmed `reviewed` action.
- Why the global summary updates after confirmation in this component-local example.
- Why the review-note form remains separate from the status Action form.
- How `use` differs from `useEffect` and from ordinary Hooks.
