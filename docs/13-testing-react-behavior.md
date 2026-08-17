# 13 Testing React Behavior

[Back to React Study Plan](../README.md)

## Goal

Test the Product Review Tracker through the same visible controls a user operates.

By the end of this lesson, the app has behavior tests for selecting a product, marking it reviewed, updating the summary, and rolling back after an API failure.

## Starting Point

Keep the cumulative app from Lesson 12:

```text
ProductReviewProvider owns products and reviewMutation
App renders ReviewSummary, filters, product list, and SelectedProductPanel
SelectedProductPanel renders ReviewNoteForm and ReviewMutationControls
ReviewMutationControls calls markProductReviewed(product.id)
```

The tests use the same app data model:

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

Do not create a smaller test-only product type that disagrees with the UI.

## Big Words

### Big Word Alert: Behavior Test

A behavior test performs a user action and checks a visible result. It verifies what the app does without depending on private component functions.

### Big Word Alert: React Testing Library

React Testing Library renders React components and queries the page through user-visible text, labels, and accessibility roles.

### Big Word Alert: `userEvent`

`userEvent` simulates realistic interactions such as clicking, typing, tabbing, and submitting a form. Its actions are asynchronous, so use `await`.

### Big Word Alert: Query By Role

A role describes what an element means to a browser and assistive technology: `button`, `heading`, `textbox`, `status`, or `alert`. Querying by role encourages accessible UI and resilient tests.

### Big Word Alert: Mock

A mock is a controlled replacement for a dependency. Here, the test replaces browser `fetch` so no real network request makes the result slow or unpredictable.

### Big Word Alert: Test Double

Test double is the general name for a fake dependency used during a test. Mocks, stubs, and spies are different kinds of test doubles.

### Big Word Alert: MSW

MSW means Mock Service Worker. It intercepts requests at the network boundary, which is useful when many tests should exercise realistic `fetch` behavior. This lesson starts with a small `fetch` mock; MSW can be introduced later when the test suite grows.

### Big Word Alert: Assertion

An assertion states what must be true after an action, such as expecting the reviewed summary to change from `0 of 3` to `1 of 3`.

### Conceptual Aside: Test Outcomes, Not Wiring

The user does not call the reducer or inspect context values. The user selects a product, clicks a button, and reads the result, so the test should follow that path too.

## App Step

Prove both outcomes of the Lesson 12 mutation:

```text
success:
select new product -> mark reviewed -> summary increases -> success appears

failure:
select new product -> mark reviewed -> request fails -> summary rolls back -> error appears
```

This lesson adds no visual redesign. It adds small accessibility details that make the existing controls easier to identify for users and tests.

## Build Steps

1. Install Vitest, jsdom, React Testing Library, jest-dom, and user-event.
2. Add the `test` script to `package.json`.
3. Configure Vitest to use jsdom and a setup file.
4. Load jest-dom matchers in `src/test/setup.ts`.
5. Give repeated `View details` buttons unique accessible names.
6. Make `ReviewSummary` announce count changes with `aria-live`.
7. Create `src/test/App.test.tsx`.
8. Mock the existing DummyJSON GET and PUT requests.
9. Render `App` inside `ProductReviewProvider`.
10. Test the success flow through visible controls.
11. Test rollback and error feedback.
12. Run the tests and then manually confirm the app UI is unchanged.

## Step 1: Install Test Tools

Install these only when you reach this lesson:

```powershell
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add a script to `package.json`:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

`@testing-library/jest-dom` works with Vitest. Its name describes the matcher package's origin; it does not require the Jest test runner.

## Step 2: Configure Vitest

Keep the React and Tailwind plugins already used by the app. Update `vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    restoreMocks: true,
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

## Step 3: Make Repeated Controls Accessible

Product cards all display the visible text `View details`. Give each button a unique accessible name while preserving its Tailwind styling:

```tsx
<button
  type="button"
  className="mt-4 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
  aria-label={`View details for ${product.name}`}
  onClick={() => onSelect(product.id)}
>
  View details
</button>
```

Update `ReviewSummary` so count changes are announced without changing its appearance:

```tsx
type ReviewSummaryProps = {
  products: Product[];
};

export function ReviewSummary({ products }: ReviewSummaryProps) {
  const reviewedCount = products.filter(
    (product) => product.reviewStatus === "reviewed",
  ).length;

  return (
    <p
      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
      aria-live="polite"
    >
      Reviewed {reviewedCount} of {products.length} products
    </p>
  );
}
```

### Conceptual Aside: Accessible Names Are Product Behavior

`aria-label` is not added only for tests. It lets a screen-reader user distinguish several controls that all visually say `View details`.

## Step 4: Create Predictable API Responses

Create `src/test/App.test.tsx`. Start with API-shaped data because Lesson 05 maps `title`, `thumbnail`, and numeric IDs into the app's `Product` shape:

```tsx
import { afterEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { ProductReviewProvider } from "../context/ProductReviewContext";

const apiProducts = [
  {
    id: 1,
    title: "Mechanical Keyboard",
    description: "A compact keyboard for daily coding.",
    price: 89,
    thumbnail: "https://example.com/keyboard.jpg",
  },
  {
    id: 2,
    title: "Wireless Mouse",
    description: "A lightweight mouse for focused work.",
    price: 49,
    thumbnail: "https://example.com/mouse.jpg",
  },
  {
    id: 3,
    title: "4K Monitor",
    description: "A sharp display for a larger workspace.",
    price: 399,
    thumbnail: "https://example.com/monitor.jpg",
  },
];

function mockProductApi(mutationFails = false) {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (init?.method === "PUT") {
        if (mutationFails) {
          return new Response(null, { status: 500 });
        }

        return new Response(JSON.stringify({ reviewStatus: "reviewed" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.includes("dummyjson.com/products")) {
        return new Response(JSON.stringify({ products: apiProducts }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(null, { status: 404 });
    },
  );

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderTracker() {
  return render(
    <ProductReviewProvider>
      <App />
    </ProductReviewProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});
```

If your provider is already rendered inside `App`, render `<App />` only. Use one provider, not two.

## Step 5: Test Selection And Successful Review

Continue in `src/test/App.test.tsx`:

```tsx
describe("Product Review Tracker", () => {
  test("selects a product and marks it reviewed", async () => {
    const user = userEvent.setup();
    const fetchMock = mockProductApi();

    renderTracker();

    expect(
      await screen.findByText("Reviewed 0 of 3 products"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "View details for Wireless Mouse",
      }),
    );

    await user.click(
      screen.getByRole("button", { name: "Mark reviewed" }),
    );

    expect(
      await screen.findByText("Reviewed 1 of 3 products"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Reviewed status saved."),
    ).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/products/2"),
      expect.objectContaining({ method: "PUT" }),
    );
  });
```

This proves the public path: API load, product selection, user click, optimistic reducer update, request, and visible confirmation.

## Step 6: Test Rollback

Add the failure test below the success test:

```tsx
  test("rolls back reviewed status when the mutation fails", async () => {
    const user = userEvent.setup();
    mockProductApi(true);

    renderTracker();
    await screen.findByText("Reviewed 0 of 3 products");

    await user.click(
      screen.getByRole("button", {
        name: "View details for Wireless Mouse",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Mark reviewed" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not mark product reviewed.",
    );

    await waitFor(() => {
      expect(
        screen.getByText("Reviewed 0 of 3 products"),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled();
  });
});
```

The count returning to `0 of 3` is the visible proof that rollback restored the product's previous status.

## UI Target

![Testing preserves the final UI](../assets/final-product-review-tracker.png)

No new panel or card is required. Preserve the cumulative UI and the Tailwind classes inside its JSX:

```text
Header summary remains beside the title on desktop.
Filters and product search remain above the two-column product/details layout.
Product cards keep image, name, description, price, and status.
SelectedProductPanel keeps ReviewNoteForm and ReviewMutationControls.
Pending, success, and error feedback keep the Lesson 12 classes.
```

The rendered-code snippets above retain Tailwind in the actual buttons and summary JSX. The only behavior additions are `aria-label` and `aria-live`; they do not remove styling or alter the visible layout.

## Run The Tests

Run once:

```powershell
pnpm test -- --run
```

Run in watch mode while coding:

```powershell
pnpm test
```

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "test(products): cover reviewed mutation behavior"
git push
```

## Common Mistakes

- Rendering `App` without the required `ProductReviewProvider`.
- Wrapping the app in two providers and testing a different state tree from production.
- Returning app-shaped `name` data from a mock when the GET boundary expects API-shaped `title` data.
- Clicking the first generic `View details` button instead of selecting a named product.
- Asserting only that some `Reviewed:` text exists instead of checking the exact count.
- Calling `dispatch` or `productReducer` directly in this behavior test.
- Using class names as selectors.
- Forgetting to `await` user events and async UI updates.

## Stop When You Can Explain

- Why the test selects `Wireless Mouse` through its button rather than setting `selectedProductId`.
- Why the GET mock uses DummyJSON fields while components use the app's `Product` fields.
- What the successful test proves beyond “the button was clicked.”
- Why the failure test checks both the alert and restored reviewed count.
- When a growing suite would benefit from MSW instead of a local `fetch` mock.
