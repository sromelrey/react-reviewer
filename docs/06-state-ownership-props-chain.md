# 06 State Ownership And Props Chain

[Back to React Study Plan](../README.md)

## Goal

Understand where state should live before reaching for Context API.

## Learn

- State ownership.
- Lifting state.
- Props chain.
- Prop drilling.
- Passing callbacks down.

## App Step

Move product state to the top-level app component.

Pass products, selected product, and actions down through props.

## UI Target

Keep the same screen while changing where state lives:

![Selection and filters](../assets/04-selection-filters-derived-state.png)

## Stop When You Can Explain

- Which component owns the product state.
- Why prop drilling becomes painful.
- Why Context API should solve a real problem, not appear too early.
