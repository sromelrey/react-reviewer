# 13 Testing React Behavior

[Back to React Study Plan](../README.md)

## Goal

Test behavior like a user.

## Learn

- React Testing Library.
- `userEvent`.
- Querying by role/name.
- Mock functions.
- Mock API or MSW.
- Jest vs Vitest idea.

## App Step

Test that a user can:

- Select a product.
- Mark it reviewed.
- See the reviewed count update.

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

## Stop When You Can Explain

- Why tests should click buttons instead of calling component functions.
- Why mocks/test doubles exist.
- When MSW is better than mocking a function.
