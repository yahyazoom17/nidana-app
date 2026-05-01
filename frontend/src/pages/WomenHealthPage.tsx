import { useState } from "react";
import {
  Flower2,
  BrainCircuit,
  History,
  Activity,
  Leaf,
  Calendar,
  Smile,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ─── Design Tokens from DESIGN.md ─── */
const colors = {
  primary: "#1B3A2E",
  secondary: "#7A8F85",
  tertiary: "#4E8B6A",
  neutral: "#F4F7F4",
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
  accent: "#E28E93", // Soft pink/rose for women's health accents
};

/* ─── Nav Items ─── */
const navItems = [
  { label: "Health Monitor", icon: Flower2, href: "/sanctuary" },
  { label: " Ayush AI ", icon: BrainCircuit, href: "/chatbot" },
  { label: "Health History", icon: History, href: "/history" },
  { label: "Women Health", icon: Activity, href: "/women-health", active: true },
];

export default function WomenHealthPage() {
  return (
    <div
      id="women-health-page"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: "'DM Sans', sans-serif",
        background: colors.neutral,
        color: colors.primary,
      }}
    >
      {/* ────────── Sidebar ────────── */}
      <aside
        id="sidebar"
        style={{
          width: 260,
          minWidth: 260,
          display: "flex",
          flexDirection: "column",
          background: colors.surface,
          borderRight: `1px solid ${colors.secondary}33`,
          padding: "32px 0 24px",
        }}
      >
        {/* Logo Area */}
        <div style={{ padding: "0 24px", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Leaf size={20} color={colors.onPrimary} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  margin: 0,
                  color: colors.primary,
                }}
              >
                Nidana
              </h1>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: colors.secondary,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                wellness guide
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: "0 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? colors.primary : colors.secondary,
                  background: isActive ? `${colors.tertiary}14` : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = colors.neutral;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon
                  size={18}
                  color={isActive ? colors.tertiary : colors.secondary}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Bottom Brand */}
        <div style={{ padding: "0 24px" }}>
          <Separator
            style={{ background: `${colors.secondary}20`, marginBottom: 16 }}
          />
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              color: colors.secondary,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Clinic Sage v1.0
          </span>
        </div>
      </aside>

      {/* ────────── Main Content ────────── */}
      <main
        id="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "28px 40px 20px",
            background: colors.surface,
            borderBottom: `1px solid ${colors.secondary}20`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 500,
                margin: 0,
                color: colors.primary,
                lineHeight: 1.25,
              }}
            >
              Women's Health
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: colors.secondary,
              lineHeight: 1.65,
              marginLeft: 20,
            }}
          >
            Your personalized space for tracking, insights, and holistic well-being.
          </p>
        </header>

        {/* Dashboard Area */}
        <ScrollArea
          className="flex-1"
          style={{ background: colors.neutral }}
        >
          <div
            style={{
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* Top Cards Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {/* Card 1 */}
              <div
                style={{
                  background: colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: `0 2px 10px ${colors.secondary}15`,
                  border: `1px solid ${colors.secondary}20`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 8, background: `${colors.accent}15`, borderRadius: 8 }}>
                    <Calendar size={20} color={colors.accent} />
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: colors.secondary }}>Cycle Phase</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 4px 0" }}>Follicular</h3>
                  <p style={{ fontSize: "0.85rem", color: colors.secondary, margin: 0 }}>Day 8 of your cycle</p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                style={{
                  background: colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: `0 2px 10px ${colors.secondary}15`,
                  border: `1px solid ${colors.secondary}20`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 8, background: `${colors.tertiary}15`, borderRadius: 8 }}>
                    <TrendingUp size={20} color={colors.tertiary} />
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: colors.secondary }}>Next Period</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 4px 0" }}>In 20 days</h3>
                  <p style={{ fontSize: "0.85rem", color: colors.secondary, margin: 0 }}>Estimated May 21</p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                style={{
                  background: colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: `0 2px 10px ${colors.secondary}15`,
                  border: `1px solid ${colors.secondary}20`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 8, background: `${colors.secondary}15`, borderRadius: 8 }}>
                    <Smile size={20} color={colors.primary} />
                  </div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: colors.secondary }}>Daily Logging</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                  <button
                    style={{
                      padding: "8px 16px",
                      background: colors.primary,
                      color: colors.onPrimary,
                      borderRadius: 8,
                      border: "none",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Log Symptoms <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Insights Section */}
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: 16 }}>Personalized Insights</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    background: colors.surface,
                    borderRadius: 12,
                    padding: 20,
                    borderLeft: `4px solid ${colors.accent}`,
                    boxShadow: `0 2px 8px ${colors.secondary}10`,
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "1rem" }}>Energy Boost Recommended</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: colors.secondary, lineHeight: 1.5 }}>
                    As you enter the follicular phase, your energy levels are rising. It's a great time to schedule challenging workouts or tackle complex tasks. Make sure to stay hydrated!
                  </p>
                </div>
                
                <div
                  style={{
                    background: colors.surface,
                    borderRadius: 12,
                    padding: 20,
                    borderLeft: `4px solid ${colors.tertiary}`,
                    boxShadow: `0 2px 8px ${colors.secondary}10`,
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "1rem" }}>Nutritional Focus</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: colors.secondary, lineHeight: 1.5 }}>
                    Incorporate foods rich in iron and Vitamin C to support your body's rebuilding process. Think spinach, citrus fruits, and lean proteins for today's meals.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
