'use client';

export default function DeleteForm({ action, confirmText, label }) {
  return (
    <form
      method="POST"
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className="delete-btn" title={label} aria-label={label}>
        ✕
      </button>
    </form>
  );
}
