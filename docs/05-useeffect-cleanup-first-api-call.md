# 05 useEffect, Cleanup, And First API Call

[Back to React Study Plan](../README.md)

## Goal

Learn how React synchronizes with an external API.

## Learn

- `useEffect`.
- Dependency array.
- Loading state.
- Error state.
- Empty state.
- `fetch`.
- `AbortController`.
- Mapping API response into app data.

## Sample API

Use DummyJSON Products:

```text
GET https://dummyjson.com/products?limit=5
GET https://dummyjson.com/products/1
```

Docs: [DummyJSON Products](https://dummyjson.com/docs/products)

## App Step

Replace hard-coded products with API-loaded products.

Add local `reviewStatus` after mapping the API product into the app product shape.

## UI Target

![API loading, error, and success states](../assets/05-api-loading-error-success.png)

## Tailwind Classes To Reuse

```text
Loading Block: animate-pulse rounded-md bg-slate-100
Error Box: rounded-md border border-red-200 bg-red-50 p-3 text-red-700
Retry Button: rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700
Success Row: flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4
```

## Stop When You Can Explain

- Why API loading belongs in an Effect.
- Why loading and error states are separate.
- Why app data shape should not blindly depend on API shape.
