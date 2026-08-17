# 13 Testing React Behavior

[Back to React Study Plan](../README.md)

## Goal

Test behavior like a user.

By the end of this lesson, the app should have one behavior test for the review flow.

## Big Words

### Big Word Alert: React Testing Library

React Testing Library helps test React components through user-visible behavior.

### Big Word Alert: userEvent

`userEvent` simulates realistic user actions, such as clicking, typing, and tabbing.

### Big Word Alert: Query By Role

Querying by role means finding elements the way assistive technology understands them.

Example: button, textbox, heading.

### Big Word Alert: Mock

A mock is a fake replacement used during a test.

### Big Word Alert: MSW

MSW means Mock Service Worker.

It can mock network requests while keeping your app's fetch code realistic.

### Conceptual Aside: Test The Behavior, Not The Implementation

The user does not call your component functions.

The user clicks buttons and sees screen updates.

Good tests follow that same path.

## App Step

Test that a user can:

- Select a product.
- Mark it reviewed.
- See the reviewed count update.

## What To Build

Add one behavior test:

```text
render app -> click product -> click Mark reviewed -> expect reviewed count to update
```

Do not test reducer internals first.

Start with visible behavior.

Visible UI behavior under test:

```text
click Mark reviewed
reviewed count changes
reviewed badge appears or remains visible
```

## Build Steps

1. Install test libraries only when you reach this lesson.
2. Add test setup if your Vite app needs it.
3. Render the app.
4. Find buttons by role and name.
5. Use `userEvent.click`.
6. Assert the reviewed count changed.
7. Mock API behavior if the test reaches API mutation.

## Install When You Reach This Lesson

```powershell
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
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
git commit -m "test(products): cover mark reviewed behavior"
git push
```

## UI Target

This lesson does not add new UI. It proves the existing UI works:

```text
Before: Reviewed 1 of 3 products
Action: user clicks Mark reviewed
After: Reviewed 2 of 3 products
```

## Styling Note

Do not add Tailwind for the test itself.

Tests should query visible text, labels, and roles from the UI you already styled in previous lessons.

## Suggested Test Shape

```tsx
test("marks a product as reviewed", async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole("button", { name: /mark reviewed/i }));

  expect(screen.getByText(/Reviewed:/)).toBeInTheDocument();
});
```

## Common Mistakes

- Calling component functions directly in tests.
- Querying by class name instead of role/name.
- Testing implementation details before user behavior.
- Forgetting async user actions need `await`.

## Stop When You Can Explain

- Why tests should click buttons instead of calling component functions.
- Why mocks/test doubles exist.
- When MSW is better than mocking a function.
- Why testing by role improves accessibility awareness.
