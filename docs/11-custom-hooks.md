# 11 Custom Hooks

[Back to React Study Plan](../README.md)

## Goal

Extract reusable logic without hiding the learning too early.

By the end of this lesson, repeated product logic should move into a custom hook.

## Big Words

### Big Word Alert: Custom Hook

A custom hook is a function that starts with `use` and can call React hooks inside it.

### Big Word Alert: Stateful Logic

Stateful logic is behavior that uses state, effects, reducers, context, or other hooks.

### Big Word Alert: Separation Of Concerns

Separation of concerns means keeping different responsibilities in different places.

UI components should focus on rendering. Hooks can hold reusable behavior.

### Conceptual Aside: Extract After You Understand

Do not create custom hooks too early.

First write the logic in the component. Then extract it when the shape becomes clear.

## App Step

Extract product loading or product review behavior into a hook.

Possible hook names:

- `useProducts`
- `useProductReview`
- `useSelectedProduct`

## What To Build

Extract one focused hook.

Good options:

```text
useProductReview -> reads context and returns state/actions
useSelectedProduct -> derives selected product
useProducts -> loads products from API
```

Do not extract everything at once.

Visible UI change:

```text
none expected
the app should behave the same after the logic moves into a hook
```

## Build Steps

1. Find repeated or noisy logic.
2. Choose one hook to extract.
3. Name it starting with `use`.
4. Move the hook logic out of the component.
5. Return only the values the component needs.
6. Keep rendering JSX inside components, not inside the hook.
7. Confirm the UI behavior does not change.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "refactor(hooks): extract product review logic"
git push
```

## UI Target

Keep the same app screen and behavior:

```text
selection still works
filters still work
review note form still works
API loading still works if you extract product loading
```

## Tailwind Classes To Preserve

Do not restyle in this lesson. Custom hooks are about logic extraction, so keep all component classes unchanged.

## Suggested Hook Shape

```ts
function useSelectedProduct(products: Product[], selectedProductId: string | null) {
  return products.find((product) => product.id === selectedProductId) ?? null;
}
```

## Common Mistakes

- Creating hooks just to move code away.
- Returning too many unrelated values from one hook.
- Putting JSX inside a hook.
- Forgetting that custom hooks follow the Rules of Hooks.

## Stop When You Can Explain

- Why custom hooks start with `use`.
- What logic belongs in a hook.
- What logic should stay inside a component.
- Why extracting a hook should not change behavior.
