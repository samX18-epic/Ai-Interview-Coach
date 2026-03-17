import { useRouteError } from "react-router-dom";
import "./ErrorPage.scss";

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="error-page">
      <div className="error-card">
        <span className="material-symbols-outlined error-icon">warning</span>
        <h1>Page Not Found</h1>
        <p>{error?.statusText || error?.message || "The page you're looking for doesn't exist."}</p>
        <div className="error-buttons">
          <button className="btn-primary" onClick={() => window.location.href = "/"}>
            Go Home
          </button>
          <button className="btn-secondary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
