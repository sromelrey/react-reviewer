# React Study Plan

This React path uses a better learning flow:

```text
Learn the concept -> see a small example -> code the concept -> apply it to one growing app
```

The goal is not to memorize hooks. The goal is to understand why React features exist, then use them in a small app from scratch.

## How To Read The Lessons

Each lesson uses two teaching patterns:

- **Big Word Alert**: a pause for vocabulary that may sound more complicated than it really is. When a term matters, we define it, explain it plainly, and show how it is used.
- **Conceptual Aside**: a short side explanation for an important idea that supports the main lesson. These asides cover concepts you will see again and again as the app grows.

Do not be intimidated by the vocabulary. Most of it is just naming ideas you will already see in the code.

### Teaching Completeness Rule

`Stop When You Can Explain` is a recall checkpoint, not a guessing exercise. Every question in that section must already be covered earlier in the lesson through:

1. A plain-language explanation of what the concept means.
2. The reason React behaves that way or the problem the concept solves.
3. A focused code example when behavior or syntax matters.
4. A direct connection to the Product Review Tracker code being changed.

For important mistakes, the lesson should contrast the incorrect and correct patterns before asking you to explain them. If a checkpoint question introduces a new fact, the lesson is incomplete and should be corrected before moving forward.

## Main Learning Path

| Level        | Topic                                                                                      | What To Learn                                                       | Code After Learning                                           |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| Basic        | [01 React Mental Model And JSX](./docs/01-react-mental-model-jsx.md)                       | Components are functions, JSX, rendering UI from data.              | Render static product cards.                                  |
| Basic        | [02 Props And Component Composition](./docs/02-props-composition.md)                       | Passing data through props, `children`, reusable components.        | Split product card into smaller components.                   |
| Basic        | [03 Events And useState](./docs/03-events-usestate.md)                                     | Event handlers, local state, and state-driven rendering.            | Select a product and update UI on click.                      |
| Basic        | [04 Lists, Keys, And Derived State](./docs/04-lists-keys-derived-state.md)                 | `.map`, stable `key`, filtering, derived counts.                    | Render and filter the product list.                           |
| Basic-Mid    | [05 useEffect, Cleanup, And First API Call](./docs/05-useeffect-cleanup-first-api-call.md) | Effects, dependency array, cleanup, async loading basics.           | Load DummyJSON products and render async UI states.           |
| Mid          | [06 State Ownership And Props Chain](./docs/06-state-ownership-props-chain.md)             | Lifting state, props chain, prop drilling problem.                  | Move state to a parent and pass actions down.                 |
| Mid          | [07 useReducer](./docs/07-usereducer.md)                                                   | Reducer, action, dispatch, predictable state transitions.           | Convert product actions to reducer actions.                   |
| Mid          | [08 Context API And Provider Hook](./docs/08-context-api-provider-hook.md)                 | Context, provider, custom hook, avoiding prop drilling.             | Share product state/actions without passing props everywhere. |
| Mid          | [09 Forms And Validation](./docs/09-forms-validation.md)                                   | Controlled forms, form submit, validation messages.                 | Add product/review form.                                      |
| Mid-Advanced | [10 useMemo, useCallback, And memo](./docs/10-memoization.md)                              | Product search, memoized values, stable callbacks, `memo`.          | Add search and optimize the product rows.                     |
| Advanced     | [11 Custom Hooks](./docs/11-custom-hooks.md)                                               | Extracting reusable state/effect logic.                             | Extract focused hooks without replacing the context hook.     |
| Advanced     | [12 Async UI And API Integration](./docs/12-api-integration.md)                            | Fetching, mutation, optimistic update, rollback.                    | Mark reviewed through an API service.                         |
| Advanced     | [13 Testing React Behavior](./docs/13-testing-react-behavior.md)                           | React Testing Library, user events, mocks/MSW, Jest/Vitest.         | Test selecting and marking a product reviewed.                |
| Advanced     | [14 React 19 Modern APIs Overview](./docs/14-react-19-modern-apis.md)                      | `use`, Actions, `useActionState`, `useFormStatus`, `useOptimistic`. | Compare modern APIs with the normal React app flow.           |

## One App Build Path

Build one app throughout the study:

[Product Review Tracker](./docs/product-review-tracker-roadmap.md)

| Phase | App Feature                 | React Concepts Practiced                                   |
| ----- | --------------------------- | ---------------------------------------------------------- |
| 1     | Static product cards        | JSX, components, props.                                    |
| 2     | Reusable product components | Composition, `children`, prop design.                      |
| 3     | Select a product            | Events, `useState`, closure in handlers.                   |
| 4     | Product list and filters    | Lists, stable `key`, derived state.                        |
| 5     | DummyJSON API loading       | `fetch`, `useEffect`, loading state, error state, cleanup. |
| 6     | Parent-owned state          | State ownership, props chain, prop drilling.               |
| 7     | Product reducer             | `useReducer`, actions, dispatch.                           |
| 8     | Global product provider     | Context API, provider hook.                                |
| 9     | Review form                 | Controlled inputs, form submit, validation.                |
| 10    | Search and optimized list   | Controlled search, `useMemo`, `useCallback`, `memo`.       |
| 11    | Extracted app logic         | Custom hooks and reusable state/effect logic.              |
| 12    | API mutation                | API service, optimistic update, rollback.                  |
| 13    | Behavior tests              | React Testing Library, userEvent, mock API/MSW.            |
| 14    | React 19 comparison         | Modern form/action APIs and optimistic UI.                 |

## Build Checklist

| Done | Phase | Lesson | Output |
| ---- | ----- | ------ | ------ |
| [x]  | 1     | [React Mental Model And JSX](./docs/01-react-mental-model-jsx.md) | Static product cards. [Image](./assets/01-static-product-cards.png) |
| [x]  | 2     | [Props And Component Composition](./docs/02-props-composition.md) | Product cards split into reusable components with a reviewed summary. |
| [x]  | 3     | [Events And useState](./docs/03-events-usestate.md) | Click a product and show selected product details. [Image](./assets/03-product-selection.png) |
| [x]  | 4     | [Lists, Keys, And Derived State](./docs/04-lists-keys-derived-state.md) | Product list, filters, and reviewed count. [Image](./assets/04-selection-filters-derived-state.png) |
| [x]  | 5     | [useEffect, Cleanup, And First API Call](./docs/05-useeffect-cleanup-first-api-call.md) | Loading, error, empty, and success states. [Image](./assets/05-api-loading-error-success.png) |
| [x]  | 6     | [State Ownership And Props Chain](./docs/06-state-ownership-props-chain.md) | Parent-owned product state passed through props. [Image](./assets/05-api-loading-error-success.png) |
| [ ]  | 7     | [useReducer](./docs/07-usereducer.md) | Product state converted to reducer actions. [Image](./assets/07-reducer-review-action.png) |
| [ ]  | 8     | [Context API And Provider Hook](./docs/08-context-api-provider-hook.md) | Product state shared through provider hook. [Image](./assets/07-reducer-review-action.png) |
| [ ]  | 9     | [Forms And Validation](./docs/09-forms-validation.md) | Review note form with validation. [Image](./assets/09-review-note-form.png) |
| [ ]  | 10    | [useMemo, useCallback, And memo](./docs/10-memoization.md) | Search input and optimized filtered product rows. [Image](./assets/10-search-memoization.png) |
| [ ]  | 11    | [Custom Hooks](./docs/11-custom-hooks.md) | Reusable app logic extracted into hooks. [Image](./assets/10-search-memoization.png) |
| [ ]  | 12    | [Async UI And API Integration](./docs/12-api-integration.md) | API mutation, optimistic update, and rollback. [Final Image](./assets/final-product-review-tracker.png) |
| [ ]  | 13    | [Testing React Behavior](./docs/13-testing-react-behavior.md) | Behavior test for selecting and reviewing a product. [Image](./assets/final-product-review-tracker.png) |
| [ ]  | 14    | [React 19 Modern APIs Overview](./docs/14-react-19-modern-apis.md) | Compare modern APIs with the normal app flow. [Image](./assets/final-product-review-tracker.png) |

## Study Rule

For every topic:

1. Read the concept.
2. Study one small example.
3. Code a small practice.
4. Apply the concept to the Product Review Tracker.
5. Answer `Stop When You Can Explain` using only material already taught in the lesson.
6. Explain what problem the concept solved in your own words.

## App Goal

By the end, the Product Review Tracker should support:

- Product list.
- Product selection.
- Status filter: all, new, reviewed.
- Product search.
- Reviewed count.
- Add or edit review notes.
- Load products from a fake/API service.
- Mark product as reviewed.
- Optimistic update with rollback.
- Context-based state access.
- At least one behavior test.

## Sample API

Use DummyJSON for product API practice:

```text
GET https://dummyjson.com/products?limit=3
GET https://dummyjson.com/products/1
```

Official docs: [DummyJSON Products](https://dummyjson.com/docs/products)

This API call should be introduced after the first fundamentals:

```text
components -> props -> events -> useState -> lists/keys -> derived state -> useEffect API call
```

Lesson 05 performs the first real `GET` request. Lesson 12 adds a mutation and optimistic UI after the state architecture is established.

## Checkpoint Questions

After each topic, answer:

1. What did I learn?
2. What did I code?
3. What changed in the app?
4. What bug does this concept prevent?
5. How would I explain this in an interview?
