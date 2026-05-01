import { useState } from "react";
import { Leaf, ArrowRight, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#1B3A2E",
  secondary: "#7A8F85",
  tertiary: "#4E8B6A",
  neutral: "#F4F7F4",
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
  accent: "#E28E93",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      // Sign in logic
      navigate("/personal-info");
    } else {
      // Registration logic
      navigate("/personal-info");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'DM Sans', sans-serif",
        background: colors.neutral,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: colors.surface,
          borderRadius: 24,
          padding: 40,
          boxShadow: `0 10px 40px ${colors.secondary}20`,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Leaf size={32} color={colors.onPrimary} />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 600,
                color: colors.primary,
                margin: "0 0 8px 0",
                letterSpacing: "-0.02em",
              }}
            >
              {isSignIn ? "Welcome Back" : "Join Nidana"}
            </h1>
            <p style={{ margin: 0, fontSize: "0.95rem", color: colors.secondary }}>
              {isSignIn
                ? "Sign in to continue your wellness journey."
                : "Your journey to mindful wellness begins here."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Full Name - Only on Registration */}
            {!isSignIn && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                  Full Name
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: colors.neutral,
                    borderRadius: 12,
                    padding: "12px 16px",
                    gap: 12,
                    border: `1px solid ${colors.secondary}30`,
                  }}
                >
                  <User size={18} color={colors.secondary} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required={!isSignIn}
                    style={{
                      flex: 1,
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      fontSize: "0.95rem",
                      color: colors.primary,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                Email Address
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: colors.neutral,
                  borderRadius: 12,
                  padding: "12px 16px",
                  gap: 12,
                  border: `1px solid ${colors.secondary}30`,
                }}
              >
                <Mail size={18} color={colors.secondary} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  required
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "0.95rem",
                    color: colors.primary,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: colors.neutral,
                  borderRadius: 12,
                  padding: "12px 16px",
                  gap: 12,
                  border: `1px solid ${colors.secondary}30`,
                }}
              >
                <Lock size={18} color={colors.secondary} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "0.95rem",
                    color: colors.primary,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: 8,
              background: colors.tertiary,
              color: colors.onPrimary,
              border: "none",
              borderRadius: 12,
              padding: "16px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.2s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {isSignIn ? "Sign In" : "Create Account"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: -8 }}>
          <p style={{ fontSize: "0.85rem", color: colors.secondary }}>
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsSignIn(!isSignIn)}
              style={{ color: colors.tertiary, fontWeight: 600, cursor: "pointer" }}
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
