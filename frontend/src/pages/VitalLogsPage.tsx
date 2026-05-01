import { useState } from "react";
import {
  Flower2,
  BrainCircuit,
  History,
  Activity,
  Leaf,
  HeartPulse,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ─── Design Tokens ─── */
const colors = {
  primary: "#1B3A2E",
  secondary: "#7A8F85",
  tertiary: "#4E8B6A",
  neutral: "#F4F7F4",
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
  accent: "#D4AF37",
  alert: "#E28E93",
  info: "#8EADE2",
  ai: "#9333EA",
};

/* ─── Nav Items ─── */
const navItems = [
  { label: "Health Monitor", icon: Activity, href: "/health-monitor" },
  { label: "Ayush AI", icon: BrainCircuit, href: "/chatbot" },
  { label: "Lifestyle Tracker", icon: History, href: "/lifestyle" },
  { label: "Vital Logs", icon: Flower2, href: "/vital-logs", active: true },
];

/* ─── Mock Data ─── */
const vitalCategories = [
  { id: "bp", label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: HeartPulse, color: colors.alert, trend: "stable", change: "+0%", history: ["118/78", "122/82", "120/80", "119/79", "120/80", "121/81", "120/80"] },
  { id: "temp", label: "Temperature", value: "98.4", unit: "°F", icon: Thermometer, color: colors.accent, trend: "stable", change: "+0.1°F", history: ["98.2", "98.6", "98.3", "98.5", "98.4", "98.3", "98.4"] },
  { id: "spo2", label: "SpO₂", value: "98", unit: "%", icon: Droplets, color: colors.info, trend: "up", change: "+1%", history: ["97", "96", "97", "98", "97", "98", "98"] },
  { id: "rr", label: "Respiratory Rate", value: "16", unit: "bpm", icon: Wind, color: colors.tertiary, trend: "stable", change: "0", history: ["15", "16", "17", "16", "15", "16", "16"] },
];

const recentLogs = [
  { id: 1, date: "Today, 8:30 AM", type: "Morning Check", vitals: { bp: "120/80", hr: "72", temp: "98.4", spo2: "98%" }, note: "Feeling well-rested." },
  { id: 2, date: "Yesterday, 9:15 PM", type: "Evening Check", vitals: { bp: "118/76", hr: "68", temp: "98.2", spo2: "97%" }, note: "Mild fatigue after exercise." },
  { id: 3, date: "Yesterday, 7:00 AM", type: "Morning Check", vitals: { bp: "122/82", hr: "74", temp: "98.6", spo2: "97%" }, note: "" },
  { id: 4, date: "Apr 30, 10:00 PM", type: "Evening Check", vitals: { bp: "119/79", hr: "70", temp: "98.3", spo2: "98%" }, note: "Good hydration today." },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function VitalLogsPage() {
  const [selectedVital, setSelectedVital] = useState("bp");

  const activeVital = vitalCategories.find((v) => v.id === selectedVital)!;
  const maxVal = Math.max(...activeVital.history.map((v) => parseFloat(v.split("/")[0])));
  const minVal = Math.min(...activeVital.history.map((v) => parseFloat(v.split("/")[0])));
  const range = maxVal - minVal || 1;

  return (
    <div
      id="vital-logs-page"
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
                  if (!isActive) e.currentTarget.style.background = colors.neutral;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
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

        <div style={{ padding: "0 24px" }}>
          <Separator style={{ background: `${colors.secondary}20`, marginBottom: 16 }} />
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
        style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        {/* Header */}
        <header
          style={{
            padding: "28px 40px 20px",
            background: colors.surface,
            borderBottom: `1px solid ${colors.secondary}20`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.alert }} />
                <h2 style={{ fontSize: "2rem", fontWeight: 500, margin: 0, color: colors.primary, lineHeight: 1.25 }}>
                  Vital Logs
                </h2>
              </div>
              <p style={{ fontSize: "0.9rem", color: colors.secondary, lineHeight: 1.65, marginLeft: 20 }}>
                Track and monitor your daily vital signs with AI-powered insights.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={{
                  background: colors.primary,
                  color: colors.onPrimary,
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(27, 58, 46, 0.15)",
                }}
              >
                <Plus size={18} /> Log Vitals
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <ScrollArea className="flex-1" style={{ background: colors.neutral }}>
          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Vital Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {vitalCategories.map((vital) => (
                <div
                  key={vital.id}
                  onClick={() => setSelectedVital(vital.id)}
                  style={{
                    background: colors.surface,
                    borderRadius: 20,
                    padding: "20px",
                    border: selectedVital === vital.id ? `2px solid ${vital.color}` : `1px solid ${colors.secondary}15`,
                    boxShadow: selectedVital === vital.id ? `0 4px 20px ${vital.color}20` : `0 2px 10px ${colors.secondary}08`,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ padding: 8, background: `${vital.color}15`, borderRadius: 10 }}>
                      <vital.icon size={20} color={vital.color} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {vital.trend === "up" ? (
                        <TrendingUp size={14} color={colors.tertiary} />
                      ) : vital.trend === "down" ? (
                        <TrendingDown size={14} color={colors.alert} />
                      ) : (
                        <TrendingUp size={14} color={colors.secondary} style={{ opacity: 0.4 }} />
                      )}
                      <span style={{ fontSize: "0.75rem", color: vital.trend === "up" ? colors.tertiary : colors.secondary }}>
                        {vital.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: colors.secondary, fontWeight: 500 }}>{vital.label}</span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{vital.value}</h3>
                      <span style={{ fontSize: "0.8rem", color: colors.secondary }}>{vital.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + AI Insight Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
              {/* Mini Chart */}
              <div
                style={{
                  background: colors.surface,
                  borderRadius: 24,
                  padding: "28px",
                  border: `1px solid ${colors.secondary}15`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
                      {activeVital.label} — 7 Day Trend
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: colors.secondary }}>Last 7 readings</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={14} color={colors.secondary} />
                    <span style={{ fontSize: "0.8rem", color: colors.secondary }}>This Week</span>
                  </div>
                </div>
                {/* Simple bar chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                  {activeVital.history.map((val, i) => {
                    const numVal = parseFloat(val.split("/")[0]);
                    const heightPct = ((numVal - minVal) / range) * 60 + 40;
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 600, color: colors.primary }}>{val}</span>
                        <div
                          style={{
                            width: "100%",
                            height: `${heightPct}%`,
                            background: i === activeVital.history.length - 1
                              ? `linear-gradient(to top, ${activeVital.color}, ${activeVital.color}80)`
                              : `${activeVital.color}25`,
                            borderRadius: 8,
                            transition: "height 0.3s ease",
                          }}
                        />
                        <span style={{ fontSize: "0.7rem", color: colors.secondary }}>{weekDays[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Insight */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.ai} 0%, #6D28D9 100%)`,
                  borderRadius: 24,
                  padding: "28px",
                  color: colors.onPrimary,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ position: "absolute", right: -30, top: -30, opacity: 0.08 }}>
                  <HeartPulse size={180} />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: 6, borderRadius: 8 }}>
                      <Sparkles size={16} color={colors.onPrimary} />
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      AI Insight
                    </span>
                  </div>
                  <p style={{ fontSize: "1rem", lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                    Your {activeVital.label.toLowerCase()} readings have been consistently within healthy range this week.
                    The trend shows excellent stability, suggesting your current lifestyle and medication are well-balanced.
                  </p>
                </div>
                <button
                  style={{
                    marginTop: 20,
                    background: colors.onPrimary,
                    color: colors.ai,
                    padding: "10px 20px",
                    borderRadius: 12,
                    border: "none",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "fit-content",
                  }}
                >
                  Full Analysis <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Recent Logs Timeline */}
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Recent Logs</h3>
                <span style={{ fontSize: "0.85rem", color: colors.secondary }}>
                  Showing latest entries
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      background: colors.surface,
                      borderRadius: 20,
                      padding: "20px 24px",
                      border: `1px solid ${colors.secondary}12`,
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      transition: "transform 0.15s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                  >
                    {/* Time */}
                    <div style={{ minWidth: 140 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <Clock size={13} color={colors.secondary} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.secondary }}>{log.date}</span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: colors.tertiary,
                          background: `${colors.tertiary}10`,
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {log.type}
                      </span>
                    </div>

                    {/* Vitals */}
                    <div style={{ flex: 1, display: "flex", gap: 24 }}>
                      {Object.entries(log.vitals).map(([key, val]) => (
                        <div key={key} style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.7rem", color: colors.secondary, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>
                            {key === "bp" ? "BP" : key === "hr" ? "HR" : key === "temp" ? "Temp" : "SpO₂"}
                          </span>
                          <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    {log.note && (
                      <div style={{ maxWidth: 200 }}>
                        <p style={{ fontSize: "0.8rem", color: colors.secondary, margin: 0, fontStyle: "italic" }}>
                          "{log.note}"
                        </p>
                      </div>
                    )}

                    <ChevronRight size={18} color={colors.secondary} style={{ opacity: 0.4 }} />
                  </div>
                ))}
              </div>
            </section>

          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
