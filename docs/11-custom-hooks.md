# 11 Custom Hooks

[Back to React Study Plan](../README.md)

## Goal

Extract understood stateful behavior into one focused custom hook.

By the end of this lesson, `ReviewNoteForm` still owns and renders the form UI, while `useReviewNoteForm` owns its draft, validation, and save behavior.

## Big Words

### Big Word Alert: Custom Hook

A custom hook is a function whose name starts with `use` and that composes React hooks into reusable stateful behavior.

### Big Word Alert: Stateful Logic

Stateful logic is code that reads or updates state, effects, context, reducers, or other hooks. It describes behavior rather than visual markup.

### Big Word Alert: Rules Of Hooks

Hooks must be called at the top level of a React component or another hook. Do not call them inside conditions, loops, event handlers, or ordinary utility functions.

### Big Word Alert: Separation Of Concerns

Separation of concerns means giving each unit a focused responsibility. The custom hook manages review-note behavior; the component manages labels, fields, buttons, messages, and Tailwind classes.

### Conceptual Aside: A Custom Hook Reuses Logic, Not State

Every call to a custom hook creates an independent hook instance. Two forms calling `useReviewNoteForm` share the behavior's design, but they do not automatically share the same draft state.

Shared saved notes still live in the reducer and Context. The hook's draft and validation error remain local.

## What To Build

```text
ReviewNoteForm renders JSX and Tailwind classes
-> useReviewNoteForm manages draft, error, and saving
   -> dispatches reviewNoteChanged through useProductReview
```

Visible UI change:

```text
none
```

The review textarea, validation message, save button, and saved-note box must look and behave exactly as they did before extraction.

## Files To Create Or Update

```text
src/hooks/useReviewNoteForm.ts
src/components/ReviewNoteForm.tsx
```

Do not create another `useProductReview` hook. Lesson 08 already established that name for reading the Provider.

## Build Steps

1. Confirm the lesson 09 form works before refactoring.
2. Create `src/hooks/useReviewNoteForm.ts`.
3. Accept `productId` and `savedNote` as the hook's inputs.
4. Move `noteDraft` and `errorMessage` state into the hook.
5. Read `dispatch` through the existing `useProductReview()` provider hook.
6. Move validation and dispatching into `submitReviewNote`.
7. Return only what the form needs: draft, error, a draft-change function, and submit function.
8. Keep all JSX and Tailwind classes in `ReviewNoteForm`.
9. Keep `key={selectedProduct.id}` where the form is rendered so product selection resets the local hook instance.
10. Retest empty submission, valid saving, product switching, filters, and selection.

## Create The Custom Hook

```ts
import { useState } from "react";
import { useProductReview } from "../context/ProductReviewContext";

type UseReviewNoteFormOptions = {
  productId: string;
  savedNote?: string;
};

export function useReviewNoteForm({
  productId,
  savedNote,
}: UseReviewNoteFormOptions) {
  const { dispatch } = useProductReview();
  const [noteDraft, setNoteDraft] = useState(savedNote ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function changeNoteDraft(nextDraft: string) {
    setNoteDraft(nextDraft);
    if (errorMessage) setErrorMessage(null);
  }

  function submitReviewNote() {
    const trimmedNote = noteDraft.trim();

    if (!trimmedNote) {
      setErrorMessage("Review note is required.");
      return false;
    }

    dispatch({
      type: "reviewNoteChanged",
      productId,
      reviewNote: trimmedNote,
    });
    setNoteDraft(trimmedNote);
    setErrorMessage(null);
    return true;
  }

  return {
    noteDraft,
    errorMessage,
    changeNoteDraft,
    submitReviewNote,
  };
}
```

Returning `false` for invalid input and `true` for a successful save makes the result explicit, though the current component does not need the result yet.

## Refactor The Form Component

The component still owns the browser submit event because that event belongs to the `<form>` element:

```tsx
import type { FormEvent } from "react";
import { useReviewNoteForm } from "../hooks/useReviewNoteForm";

type ReviewNoteFormProps = {
  productId: string;
  savedNote?: string;
};

export function ReviewNoteForm({
  productId,
  savedNote,
}: ReviewNoteFormProps) {
  const {
    noteDraft,
    errorMessage,
    changeNoteDraft,
    submitReviewNote,
  } = useReviewNoteForm({ productId, savedNote });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitReviewNote();
  }

  return (
    <form
      className="mt-4 space-y-3 border-t border-slate-200 pt-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor={`review-note-${productId}`}
        >
          Review note
        </label>

        <textarea
          id={`review-note-${productId}`}
          className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-blue-500"
          value={noteDraft}
          onChange={(event) => changeNoteDraft(event.target.value)}
          aria-invalid={errorMessage !== null}
          aria-describedby={
            errorMessage ? `review-note-error-${productId}` : undefined
          }
          placeholder="Write what you learned about this product"
        />

        {errorMessage && (
          <p
            id={`review-note-error-${productId}`}
            className="mt-2 text-sm font-medium text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save note
        </button>
      </div>

      {savedNote && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-950">Saved note:</span>{" "}
          {savedNote}
        </div>
      )}
    </form>
  );
}
```

Keep the form invocation unchanged:

```tsx
<ReviewNoteForm
  key={selectedProduct.id}
  productId={selectedProduct.id}
  savedNote={selectedProduct.reviewNote}
/>
```

## Why Not Extract More Yet

Do not combine fetching, filters, selection, form validation, and rendering into one large hook. Those responsibilities change for different reasons.

```text
useProductReview -> access shared reducer state and dispatch
useReviewNoteForm -> manage one review-note draft and validation
ReviewNoteForm -> render accessible form UI
ProductList -> derive and render visible products
```

## UI Target

![Custom-hook refactor preserves the search and form UI](../assets/10-search-memoization.png)

Custom hooks change the code organization, not the rendered screen. Preserve the completed lesson 10 target exactly.

No Tailwind classes should disappear during extraction:

- The form stays below a top border inside the selected-product panel.
- The textarea keeps a stable minimum height and visible focus border.
- Validation remains red and uses `role="alert"`.
- The save button stays right-aligned.
- The saved note remains in the gray bordered box.
- The Lesson 10 search input remains beside the status filters.
- Changing products resets local hook state because the form key changes.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "refactor(hooks): extract review note form behavior"
git push
```

## Common Mistakes

- Naming an ordinary utility with `use` even though it contains no hook behavior.
- Calling the hook inside `handleSubmit` instead of at the component's top level.
- Moving JSX or Tailwind decisions into the hook.
- Creating a second context hook named `useProductReview`.
- Returning the entire context when the hook only needs form behavior.
- Expecting separate custom-hook calls to share local draft state.

## Stop When You Can Explain

- Why the function name starts with `use`.
- Which behavior moved into the hook and which UI stayed in the component.
- Why each hook call owns independent local state.
- Why shared saved data still belongs in Context and the reducer.
- Why extraction should not change visible behavior.
