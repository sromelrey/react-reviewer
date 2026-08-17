# 08 Context API And Provider Hook

[Back to React Study Plan](../README.md)

## Goal

Solve prop drilling after experiencing it.

By the end of this lesson, product state and actions should be available through Context API.

## Big Words

### Big Word Alert: Context API

Context API is React's built-in way to pass values through the component tree without manually passing props at every level.

### Big Word Alert: Provider

A Provider makes a context value available to components below it.

### Big Word Alert: useContext

`useContext` reads the nearest matching Provider value above the component.

### Big Word Alert: Provider Hook

A provider hook is a custom hook that wraps `useContext`.

It gives your app one clean way to read context and can throw a clear error if the Provider is missing.

### Conceptual Aside: Context Removes Plumbing, Not Thinking

Context removes repetitive prop passing.

It does not remove the need to decide who owns state, what actions exist, or how updates work.

## App Step

Create a Product Review provider.

Expose state and actions through a custom hook.

## What To Build

Create a context around the reducer from lesson 07:

```text
ProductReviewProvider
-> useProductReview()
-> components read state/actions without prop drilling
```

The UI should not change.

The data access pattern changes.

Visible UI change:

```text
none expected
components should read product review state through useProductReview instead of long prop chains
```

## Build Steps

1. Create `ProductReviewContext`.
2. Put `state` and `dispatch` in the context value.
3. Create `ProductReviewProvider`.
4. Move `useReducer` into the provider.
5. Wrap the app with the provider.
6. Create `useProductReview`.
7. Throw an error if the hook is used outside the provider.
8. Remove repeated props from components that can read context directly.
9. Confirm selecting, filtering, and reviewed state still work.

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

## UI Target

The UI should look the same. The internal state access changes:

![Selection and filters](../assets/04-selection-filters-derived-state.png)

Expected visible behavior:

```text
selection still works
filters still work
review actions still work
removing prop drilling should not remove UI behavior
```

## Tailwind Classes To Preserve

Do not restyle in this lesson. Keep the existing layout and component classes:

```text
Layout: grid gap-4 md:grid-cols-[1fr_360px]
Card: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
Panel: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
Button: rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700
```

## Suggested Provider Hook Shape

```tsx
function useProductReview() {
  const value = useContext(ProductReviewContext);

  if (!value) {
    throw new Error("useProductReview must be used inside ProductReviewProvider");
  }

  return value;
}
```

## Common Mistakes

- Putting everything in Context because it feels convenient.
- Forgetting to wrap the app with the Provider.
- Allowing `null` context values to spread through the app.
- Using Context for fast-changing local input state that belongs in one component.

## Stop When You Can Explain

- What prop drilling problem Context API solves.
- Why a provider hook is cleaner than raw `useContext` everywhere.
- Why Context is not automatically a replacement for all state management.
- What state should stay local even after Context is added.
