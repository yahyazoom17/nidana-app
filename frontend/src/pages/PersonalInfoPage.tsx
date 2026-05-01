import { useState, useRef } from "react";
import { Activity, ArrowRight, Upload } from "lucide-react";
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

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    medicalHistory: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save this data to context/backend
    navigate("/chatbot");
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
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
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
            <Activity size={32} color={colors.onPrimary} />
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
              Personalize Your Care
            </h1>
            <p style={{ margin: 0, fontSize: "0.95rem", color: colors.secondary }}>
              Tell us a little about yourself to get tailored wellness guidance.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <div style={{ display: "flex", gap: 16 }}>
            {/* Age */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Years"
                required
                style={{
                  background: colors.neutral,
                  borderRadius: 12,
                  padding: "12px 16px",
                  border: `1px solid ${colors.secondary}30`,
                  outline: "none",
                  fontSize: "0.95rem",
                  color: colors.primary,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            {/* Gender */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={{
                  background: colors.neutral,
                  borderRadius: 12,
                  padding: "12px 16px",
                  border: `1px solid ${colors.secondary}30`,
                  outline: "none",
                  fontSize: "0.95rem",
                  color: colors.primary,
                  fontFamily: "'DM Sans', sans-serif",
                  appearance: "none",
                }}
              >
                <option value="" disabled>Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {/* Height */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="165"
                style={{
                  background: colors.neutral,
                  borderRadius: 12,
                  padding: "12px 16px",
                  border: `1px solid ${colors.secondary}30`,
                  outline: "none",
                  fontSize: "0.95rem",
                  color: colors.primary,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            {/* Weight */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="60"
                style={{
                  background: colors.neutral,
                  borderRadius: 12,
                  padding: "12px 16px",
                  border: `1px solid ${colors.secondary}30`,
                  outline: "none",
                  fontSize: "0.95rem",
                  color: colors.primary,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>
          </div>

          {/* Medical History */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
              Previous Medical History (Optional)
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Any ongoing conditions, allergies, or past surgeries..."
              rows={4}
              style={{
                background: colors.neutral,
                borderRadius: 12,
                padding: "12px 16px",
                border: `1px solid ${colors.secondary}30`,
                outline: "none",
                fontSize: "0.95rem",
                color: colors.primary,
                fontFamily: "'DM Sans', sans-serif",
                resize: "none",
              }}
            />
          </div>

          {/* Report Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: colors.primary }}>
              Upload Medical Report (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                background: colors.neutral,
                borderRadius: 12,
                padding: "16px",
                border: `1px dashed ${colors.secondary}60`,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${colors.secondary}15`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = colors.neutral)}
            >
              <Upload size={18} color={colors.secondary} />
              <span style={{ fontSize: "0.9rem", color: colors.secondary }}>
                {fileName ? fileName : "Click to upload files"}
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: 12,
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
            Continue to Dashboard
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
