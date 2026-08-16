# 12 Async UI And API Integration

[Back to React Study Plan](../README.md)

## Goal

Move beyond loading data and practice mutation.

## Learn

- API service file.
- Server state.
- Mutation.
- Optimistic update.
- Rollback on failure.
- Retry.

## App Step

Simulate marking a product as reviewed through an API service.

Optimistically update the UI first.

Rollback if the request fails.

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

## Stop When You Can Explain

- What data is server-owned.
- Why optimistic UI is temporary.
- What rollback protects against.
