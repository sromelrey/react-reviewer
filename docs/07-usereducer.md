# 07 useReducer

[Back to React Study Plan](../README.md)

## Goal

Make state transitions explicit.

## Learn

- Reducer.
- Action.
- Dispatch.
- Pure update logic.
- Discriminated union style actions.

## App Step

Convert product state updates into reducer actions:

- `selected`
- `filterChanged`
- `reviewed`
- `reviewNoteChanged`
- `productsLoaded`
- `productsLoadFailed`

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

## Stop When You Can Explain

- Why reducer actions are easier to read than scattered setters.
- Why reducers should be pure.
- When `useReducer` is better than multiple `useState` calls.
