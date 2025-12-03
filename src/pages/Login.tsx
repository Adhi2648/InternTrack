import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-400" />
        )}
      </button>
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Sign in to InternTrack
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-foreground">Username</span>
            <input
              className="mt-1 rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-foreground">Password</span>
            <input
              type="password"
              className="mt-1 rounded border border-input bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                setUsername("demo");
                setPassword("demo");
              }}
            >
              Fill demo
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-sm text-primary hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
