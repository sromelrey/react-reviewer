# 08 Context API And Provider Hook

[Back to React Study Plan](../README.md)

## Goal

Solve prop drilling after experiencing it.

## Learn

- Context API.
- Provider.
- Consumer through `useContext`.
- Provider hook.
- Guarding against missing provider.

## App Step

Create a Product Review provider.

Expose state and actions through a custom hook.

## UI Target

The UI should look the same. The internal state access changes:

![Selection and filters](../assets/04-selection-filters-derived-state.png)

## Stop When You Can Explain

- What prop drilling problem Context API solves.
- Why a provider hook is cleaner than raw `useContext` everywhere.
- Why Context is not automatically a replacement for all state management.
