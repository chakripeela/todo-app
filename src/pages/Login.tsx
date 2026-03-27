import { useMsal } from "@azure/msal-react";
import "../styles/Auth.css";
import React from "react";

export function Login() {
  const { instance, inProgress } = useMsal();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleMsalLogin = () => {
    setError("");
    setLoading(true);
    instance.loginRedirect({
      scopes: ["User.Read"], // Adjust scopes as needed
    });
  };

  return (
    <div className="auth-container">
      <div className="form-wrapper">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleMsalLogin}
            disabled={inProgress !== "none" || loading}
          >
            {loading ? "Signing in..." : "Sign in with Microsoft"}
          </button>
        </div>
      </div>
    </div>
  );
}
