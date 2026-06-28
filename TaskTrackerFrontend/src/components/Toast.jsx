function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}

export default Toast;