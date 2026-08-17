# Product Review Tracker Roadmap

[Back to React Study Plan](../README.md)

This is the one app we build during the React study.

## App Idea

A small dashboard for reviewing products.

The app starts in one file, then gets refactored as the lessons introduce better structure.

## Final UI Target

![Final Product Review Tracker](../assets/final-product-review-tracker.png)

## Styling Rule

Use Tailwind as copy/paste styling while studying React.

The goal is to remove styling friction, not to turn this into a CSS lesson. Each lesson should either suggest Tailwind classes for new UI or tell you to preserve the existing styling when the lesson is about architecture.

Tailwind classes must appear in the JSX examples where the element is introduced. A separate class reference may help, but it does not replace a styled code example.

## Cumulative UI Rule

Every lesson continues from the previous lesson.

- Preserve working features and visible styling unless the lesson explicitly changes them.
- State-management refactors should keep the rendered UI unchanged.
- When a lesson adds UI, its build steps must name the component, its props, its visible position, and its Tailwind classes.
- A lesson image may show a later phase only when the lesson clearly identifies which parts are not built yet.

## Canonical Product Shape

The local hard-coded products begin with this shape:

```ts
type ReviewStatus = "new" | "reviewed";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  reviewStatus: ReviewStatus;
};
```

Lesson 05 adds the API-backed image while mapping DummyJSON data:

```ts
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  reviewStatus: ReviewStatus;
};
```

Use these names consistently in later lessons. DummyJSON's `title` and `thumbnail` belong only to the API response type; map them to `name` and `imageUrl` at the API boundary.

Lesson 09 adds `reviewNote?: string`. It is optional because an API product has no saved local note until the user submits the form.

## One-File First

Start with one file so the behavior is easy to see:

```text
ProductReviewTracker.tsx
```

In the first version, keep together:

- hard-coded products
- selected product state
- filter state
- derived reviewed count
- event handlers
- JSX

## Git Checkpoint

Use the Git checkpoint inside each lesson. Commit only after the lesson's app phase works.

## Refactor Later

After the one-file version works, refactor gradually:

```text
components/
  ProductList.tsx
  ProductRow.tsx
  FilterTabs.tsx
  SelectedProductPanel.tsx
  ReviewSummary.tsx

context/
  ProductReviewContext.tsx

hooks/
  useProducts.ts

api/
  productApi.ts
```

## API Plan

Use DummyJSON:

```text
GET https://dummyjson.com/products?limit=3
```

Map each API product into the app's product shape and add local review fields.

## Final App Features

- Product list.
- Product selection.
- Status filters.
- Product search.
- Reviewed count.
- Review notes.
- API loading.
- Loading, error, and empty states.
- Mark reviewed action.
- Optimistic update and rollback.
- Context API state access.
- Behavior test.
