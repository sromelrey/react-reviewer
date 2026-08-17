# 03 Events And useState

[Back to React Study Plan](../README.md)

## Goal

Learn local interactivity.

By the end of this lesson, clicking a product should update the selected product panel.

## Big Words

### Big Word Alert: Event Handler

An event handler is a function React runs after a user action, such as clicking a button.

In JSX, `onClick` should receive a function.

### Big Word Alert: Closure

A closure is when a function remembers values from the scope where it was created.

In this lesson, each product click handler remembers which product was clicked.

### Big Word Alert: useState

`useState` stores local component state.

Use it when one component needs to remember something that changes over time.

### Conceptual Aside: State Changes Render Output

When state changes, React calls the component again.

The component returns new JSX based on the new state.

That is how clicking a product changes the selected product panel.

## App Step

Add product selection.

Clicking a product should update the selected product panel.

## What To Build

Add selected product behavior:

```text
click product card -> selectedProductId changes -> selected product panel updates
```

Still keep state local in `App.tsx`.

Do not use Context API yet.

Visible UI change:

```text
left side: product cards
right side: selected product details
selected card: blue border/background
```

## Build Steps

1. Import `useState`.
2. Add `selectedProductId` state in `App`.
3. Set the initial selected product to `"keyboard"`.
4. Find the selected product from the products array.
5. Add a selected product panel on the right.
6. Add an `onSelect` prop to `ProductCard`.
7. Inside each card/button, call `onSelect(product.id)`.
8. Add a selected style when `product.id === selectedProductId`.
9. Explain where closure happens in the click handler.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "feat(products): add product selection"
git push
```

## UI Target

![Selection and selected product panel](../assets/04-selection-filters-derived-state.png)

Expected visible structure:

```text
Product Review Tracker
Reviewed 1 of 3 products
[Keyboard card selected] [Mouse card] [Monitor card]
[Selected Product Panel]
```

## Tailwind Classes To Reuse

```text
Layout: grid gap-4 md:grid-cols-[1fr_360px]
Selected Row: border-blue-500 bg-blue-50
Button: rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700
Panel: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
Panel Title: text-lg font-semibold text-slate-950
Panel Text: mt-2 text-sm leading-6 text-slate-600
```

## Suggested State Shape

```tsx
const [selectedProductId, setSelectedProductId] = useState("keyboard");

const selectedProduct = products.find(
  (product) => product.id === selectedProductId,
);
```

## Suggested Handler Shape

```tsx
function handleSelectProduct(productId: string) {
  setSelectedProductId(productId);
}
```

## Common Mistakes

- Writing `onClick={handleSelectProduct(product.id)}` and calling the function during render.
- Storing the whole selected product object when the ID is enough.
- Forgetting that state updates cause React to render again.
- Moving to Context API before props and local state are understood.

## Stop When You Can Explain

- Why `onClick` receives a function.
- Where closure appears.
- When `useState` is enough.
- Why selected product can be derived from `selectedProductId`.
