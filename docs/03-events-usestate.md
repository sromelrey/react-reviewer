# 03 Events And useState

[Back to React Study Plan](../README.md)

## Goal

Learn local interactivity.

## Learn

- Event handlers.
- Closure in event handlers.
- `useState`.
- Controlled inputs.
- Updating state from previous state.

## App Step

Add product selection.

Clicking a product should update the selected product panel.

## UI Target

![Selection and selected product panel](../assets/04-selection-filters-derived-state.png)

## Tailwind Classes To Reuse

```text
Layout: grid gap-4 md:grid-cols-[1fr_360px]
Selected Row: border-blue-500 bg-blue-50
Button: rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700
Panel: rounded-lg border border-slate-200 bg-white p-4 shadow-sm
```

## Stop When You Can Explain

- Why `onClick` receives a function.
- Where closure appears.
- When `useState` is enough.
