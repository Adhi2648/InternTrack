import React from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Account created! Please log in." },
        });
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Create InternTrack Account
        </h2>

        {success ? (
          <div className="text-center">
            <div className="mb-4 text-sm text-green-600">
              Account created successfully! Redirecting to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span className="text-sm">Username</span>
              <input
                className="mt-1 rounded border px-2 py-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">Password</span>
              <input
                type="password"
                className="mt-1 rounded border px-2 py-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">Confirm Password</span>
              <input
                type="password"
                className="mt-1 rounded border px-2 py-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </label>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-primary hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
