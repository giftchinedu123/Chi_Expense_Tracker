import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-container">
      <section className="empty-state-card">
        <div className="empty-state-icon" aria-hidden="true">
          <i className="fa-solid fa-compass" />
        </div>
        <h1 className="empty-state-title">Page not found</h1>
        <p className="empty-state-message">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="empty-state-actions">
          <Link to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
