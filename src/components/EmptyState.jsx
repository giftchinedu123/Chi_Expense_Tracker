export default function EmptyState({
  iconClass = 'fa-solid fa-wallet',
  title,
  message,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="empty-state-card" aria-live="polite">
      <div className="empty-state-icon" aria-hidden="true">
        <i className={iconClass} />
      </div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>

      {(primaryAction || secondaryAction) && (
        <div className="empty-state-actions">
          {primaryAction && (
            <button
              type="button"
              className="btn-primary"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              className="btn-secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
