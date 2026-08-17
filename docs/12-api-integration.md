# 12 Async UI And API Integration

[Back to React Study Plan](../README.md)

## Goal

Move beyond loading data and practice mutation.

By the end of this lesson, marking a product reviewed should simulate an API mutation with optimistic UI and rollback.

## Big Words

### Big Word Alert: API Service

An API service is a separate file or module that contains API request functions.

It keeps fetch details out of UI components.

### Big Word Alert: Server State

Server state is data owned by an API, backend, or database.

The frontend can display or request changes, but it is not the ultimate source of truth.

### Big Word Alert: Mutation

A mutation is an operation that changes server-owned data.

### Big Word Alert: Optimistic Update

An optimistic update changes the UI before the server confirms success.

### Big Word Alert: Rollback

Rollback means undoing an optimistic UI change when the server request fails.

### Conceptual Aside: Optimistic UI Is A Promise, Not Truth

Optimistic UI makes the app feel fast.

But until the server confirms, the UI is only showing the expected result.

## App Step

Simulate marking a product as reviewed through an API service.

Optimistically update the UI first.

Rollback if the request fails.

## What To Build

Create an API service function:

```text
markProductReviewed(productId)
```

When the user clicks `Mark reviewed`:

```text
optimistically mark reviewed -> call API -> keep change if success -> rollback if failure
```

Visible UI change:

```text
Mark reviewed button appears for a selected product
pending state disables the button or changes its text
success keeps the reviewed badge/count
failure restores the previous state and shows an error
```

## Build Steps

1. Create an API service file.
2. Add `markProductReviewed(productId)`.
3. In the UI, dispatch an optimistic `reviewed` action immediately.
4. Call the API service.
5. If the request succeeds, keep the optimistic change.
6. If the request fails, dispatch a rollback action.
7. Show an error message.
8. Let the user retry.

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

## UI Target

Use the final app layout as the mutation target:

![Final Product Review Tracker](../assets/final-product-review-tracker.png)

Expected visible behavior:

```text
[Mark reviewed]
[Marking...]
Reviewed count increases
or
Could not mark product reviewed. [Retry]
```

## Tailwind Classes To Reuse

```text
Primary Button: rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300
Secondary Button: rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50
Mutation Error: rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700
Pending Text: text-sm font-medium text-slate-500
Reviewed Badge: rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700
```

## Suggested API Shape

```ts
async function markProductReviewed(productId: string) {
  const response = await fetch(`https://dummyjson.com/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewStatus: "reviewed" }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark product as reviewed.");
  }
}
```

## Common Mistakes

- Treating optimistic state as confirmed server truth.
- Forgetting rollback.
- Mixing API request code directly into every component.
- Not showing the user when a mutation fails.

## Stop When You Can Explain

- What data is server-owned.
- Why optimistic UI is temporary.
- What rollback protects against.
- Why an API service file keeps components cleaner.
