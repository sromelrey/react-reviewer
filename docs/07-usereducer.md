# 07 useReducer

[Back to React Study Plan](../README.md)

## Goal

Make state transitions explicit.

By the end of this lesson, product state changes should go through a reducer.

## Big Words

### Big Word Alert: Reducer

A reducer is a pure function that receives current state and an action, then returns next state.

### Big Word Alert: Action

An action is an object that describes what happened.

Example:

```ts
{ type: "selected", productId: "keyboard" }
```

### Big Word Alert: Dispatch

`dispatch` sends an action to the reducer.

### Big Word Alert: Pure Function

A pure function does not mutate its inputs and does not cause side effects.

Given the same state and action, it should return the same next state.

### Conceptual Aside: Name The State Transition

Multiple `setState` calls tell you how state changes.

Reducer actions tell you what happened.

That makes app behavior easier to read as the product logic grows.

## App Step

Convert product state updates into reducer actions:

- `selected`
- `filterChanged`
- `reviewed`
- `reviewNoteChanged`
- `productsLoaded`
- `productsLoadFailed`

## What To Build

Replace scattered product state setters with:

```text
state -> action -> reducer -> next state
```

Use `useReducer` in `App`.

Visible UI change:

```text
none expected
the same buttons should now dispatch actions instead of calling scattered setters
```

## Build Steps

1. Create `ProductState` type.
2. Create `ProductAction` union type.
3. Move initial state into `initialProductState`.
4. Create `productReducer`.
5. Handle `selected`.
6. Handle `filterChanged`.
7. Handle `reviewed`.
8. Handle API loading actions if they already exist.
9. Replace setter calls with `dispatch(...)`.
10. Confirm the UI still behaves the same.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "refactor(state): move product state into reducer"
git push
```

## UI Target

Keep the same screen while changing how state transitions happen:

![Selection and filters](../assets/04-selection-filters-derived-state.png)

Expected visible behavior:

```text
select product -> reducer handles selected action
change filter -> reducer handles filterChanged action
mark reviewed -> reducer handles reviewed action
```

## Tailwind Classes To Preserve

Do not restyle in this lesson. Keep the visual classes from lessons 03 and 04:

```text
Selected Row: border-blue-500 bg-blue-50
Active Filter: bg-blue-600 px-4 py-2 font-medium text-white
Inactive Filter: bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50
Panel: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
```

## Suggested Reducer Shape

```ts
type ProductAction =
  | { type: "selected"; productId: string }
  | { type: "filterChanged"; filter: ProductFilter }
  | { type: "reviewed"; productId: string };

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case "selected":
      return { ...state, selectedProductId: action.productId };
    default:
      return state;
  }
}
```

## Common Mistakes

- Mutating `state.products` inside the reducer.
- Doing API calls inside the reducer.
- Using vague action names like `setData`.
- Returning only partial state instead of the full next state.

## Stop When You Can Explain

- Why reducer actions are easier to read than scattered setters.
- Why reducers should be pure.
- When `useReducer` is better than multiple `useState` calls.
- Why action names should describe what happened.
