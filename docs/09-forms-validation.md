# 09 Forms And Validation

[Back to React Study Plan](../README.md)

## Goal

Handle user input safely.

By the end of this lesson, the selected product should have a review note form with validation.

## Big Words

### Big Word Alert: Controlled Input

A controlled input gets its value from React state and updates that state on change.

React becomes the source of truth for the input value.

### Big Word Alert: Form Submit

Form submit is the event that runs when the user submits the form by clicking a submit button or pressing Enter.

### Big Word Alert: Validation

Validation checks whether user input is acceptable before saving or sending it.

### Conceptual Aside: Form State Is Temporary

The text currently being typed is form state.

The saved review note is product state.

Keeping those separate makes it easier to cancel, validate, and save intentionally.

## App Step

Add review notes for the selected product.

Validate that the note is not empty before saving.

## What To Build

Add a review note form in the selected product panel:

```text
textarea -> Save note button -> validation message -> product review note updates
```

Visible UI change:

```text
selected product panel gets a review note textarea
empty submit shows an error
valid submit saves and displays the note
```

## Build Steps

1. Add local `noteDraft` state in the selected product panel.
2. Render a `textarea`.
3. Set textarea `value` from `noteDraft`.
4. Update `noteDraft` in `onChange`.
5. Add a form submit handler.
6. Prevent default form submit behavior.
7. Validate that `noteDraft.trim()` is not empty.
8. Show a validation message when empty.
9. Dispatch or call a save-note action when valid.
10. Clear the validation message after a successful save.

## Git Checkpoint

Before coding:

```powershell
git status
```

After coding:

```powershell
git status
git add .
git commit -m "feat(forms): add review note form"
git push
```

## UI Target

Use the selected product panel from the previous lessons and add the form below the product details:

```text
Selected Product
Keyboard
[review note textarea]
[Save note]
Review note is required.
Saved note: Good keyboard for daily coding.
```

## Suggested Handler Shape

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!noteDraft.trim()) {
    setErrorMessage("Review note is required.");
    return;
  }

  // save note
}
```

## Tailwind Classes To Reuse

```text
Form: mt-4 space-y-3 border-t border-slate-200 pt-4
Label: block text-sm font-medium text-slate-700
Textarea: min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500
Error Text: mt-2 text-sm font-medium text-red-700
Form Actions: mt-3 flex justify-end
Save Button: rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700
Saved Note: rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700
```

## Common Mistakes

- Letting the browser reload the page on submit.
- Treating form draft state and saved product state as the same thing.
- Validating only visually but still saving invalid data.
- Forgetting that textarea values come from `event.target.value`.

## Stop When You Can Explain

- Why controlled inputs store value in React state.
- Where validation should happen.
- How form state differs from product state.
- Why `event.preventDefault()` is needed.
