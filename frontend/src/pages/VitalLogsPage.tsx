import { useState, useEffect } from "react";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchVitalLogsDashboard,
  type VitalLogsDashboard,
  type VitalSummaryItem,
  type TrendPoint,
  type VitalLog,
} from "@/lib/api";
import { mockVitalLogsDashboard, MOCK_PATIENT } from "@/lib/mockData";

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

/* ─── Metric icon/color map ─── */
const metricMeta: Record<string, { icon: typeof HeartPulse; color: string }> = {
  "Blood Pressure": { icon: HeartPulse, color: colors.alert },
  "Temperature": { icon: Thermometer, color: colors.accent },
  "SpO2": { icon: Droplets, color: colors.info },
  "Respiratory Rate": { icon: Wind, color: colors.tertiary },
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function VitalLogsPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>("Blood Pressure");
  const [dashboard, setDashboard] = useState<VitalLogsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVitalLogsDashboard()
      .then((data) => {
        setDashboard(data);
        setError(null);
        // Auto-select the first metric if available
        if (data.summary_cards.length > 0) {
          setSelectedMetric(data.summary_cards[0].metric);
        }
      })
      .catch((err) => {
        console.error("Failed to load vital logs dashboard, using mock data:", err);
        setDashboard(mockVitalLogsDashboard);
        if (mockVitalLogsDashboard.summary_cards.length > 0) {
          setSelectedMetric(mockVitalLogsDashboard.summary_cards[0].metric);
        }
        setError(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const summaryCards: VitalSummaryItem[] = dashboard?.summary_cards ?? [];
  const trend7day: TrendPoint[] = dashboard?.trend_7day ?? [];
  const aiInsight = dashboard?.ai_insight;
  const recentLogs: VitalLog[] = dashboard?.recent_logs ?? [];

  // Build chart data from trend_7day
  const chartValues = trend7day.map((t) => t.bp_systolic ?? 0);
  const maxVal = chartValues.length > 0 ? Math.max(...chartValues) : 1;
  const minVal = chartValues.length > 0 ? Math.min(...chartValues) : 0;
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
                Patient: <strong style={{ color: colors.primary }}>{MOCK_PATIENT.fullName}</strong> — Track and monitor your daily vital signs with AI-powered insights.
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

            {/* Loading State */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12 }}>
                <Loader2 size={24} color={colors.ai} style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: "1rem", color: colors.secondary }}>Loading vital logs...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px", background: `${colors.alert}10`, borderRadius: 16, border: `1px solid ${colors.alert}30` }}>
                <AlertTriangle size={20} color={colors.alert} />
                <span style={{ fontSize: "0.9rem", color: colors.primary }}>{error}</span>
              </div>
            )}

            {/* Data Loaded */}
            {!loading && !error && dashboard && (
              <>
                {/* Vital Summary Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  {summaryCards.map((vital) => {
                    const meta = metricMeta[vital.metric] ?? { icon: HeartPulse, color: colors.info };
                    const VitalIcon = meta.icon;
                    const isSelected = selectedMetric === vital.metric;
                    const changePct = vital.change_pct;
                    const trendDir = changePct !== null ? (changePct > 0 ? "up" : changePct < 0 ? "down" : "stable") : "stable";
                    const changeStr = changePct !== null ? `${changePct > 0 ? "+" : ""}${changePct}%` : "0";
                    return (
                      <div
                        key={vital.metric}
                        onClick={() => setSelectedMetric(vital.metric)}
                        style={{
                          background: colors.surface,
                          borderRadius: 20,
                          padding: "20px",
                          border: isSelected ? `2px solid ${meta.color}` : `1px solid ${colors.secondary}15`,
                          boxShadow: isSelected ? `0 4px 20px ${meta.color}20` : `0 2px 10px ${colors.secondary}08`,
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
                          <div style={{ padding: 8, background: `${meta.color}15`, borderRadius: 10 }}>
                            <VitalIcon size={20} color={meta.color} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {trendDir === "up" ? (
                              <TrendingUp size={14} color={colors.tertiary} />
                            ) : trendDir === "down" ? (
                              <TrendingDown size={14} color={colors.alert} />
                            ) : (
                              <TrendingUp size={14} color={colors.secondary} style={{ opacity: 0.4 }} />
                            )}
                            <span style={{ fontSize: "0.75rem", color: trendDir === "up" ? colors.tertiary : colors.secondary }}>
                              {changeStr}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: "0.8rem", color: colors.secondary, fontWeight: 500 }}>{vital.metric}</span>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>{vital.display_value}</h3>
                            <span style={{ fontSize: "0.8rem", color: colors.secondary }}>{vital.unit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chart + AI Insight Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
                  {/* Mini Chart — 7-day BP trend */}
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
                          Blood Pressure — 7 Day Trend
                        </h3>
                        <span style={{ fontSize: "0.8rem", color: colors.secondary }}>{trend7day.length} readings</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={14} color={colors.secondary} />
                        <span style={{ fontSize: "0.8rem", color: colors.secondary }}>This Week</span>
                      </div>
                    </div>
                    {/* Bar chart */}
                    {trend7day.length > 0 ? (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                        {trend7day.map((point, i) => {
                          const numVal = point.bp_systolic ?? 0;
                          const heightPct = range > 0 ? ((numVal - minVal) / range) * 60 + 40 : 50;
                          const dateObj = new Date(point.date);
                          const dayLabel = weekDays[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1] || dateObj.toLocaleDateString("en-US", { weekday: "short" });
                          const displayVal = point.bp_diastolic
                            ? `${point.bp_systolic}/${point.bp_diastolic}`
                            : `${point.bp_systolic}`;
                          return (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: colors.primary }}>{displayVal}</span>
                              <div
                                style={{
                                  width: "100%",
                                  height: `${heightPct}%`,
                                  background: i === trend7day.length - 1
                                    ? `linear-gradient(to top, ${colors.alert}, ${colors.alert}80)`
                                    : `${colors.alert}25`,
                                  borderRadius: 8,
                                  transition: "height 0.3s ease",
                                }}
                              />
                              <span style={{ fontSize: "0.7rem", color: colors.secondary }}>{dayLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ fontSize: "0.85rem", color: colors.secondary }}>No trend data available yet.</p>
                      </div>
                    )}
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
                        {aiInsight?.summary ??
                          "No AI insights available yet. Log more vitals to generate insights."}
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
                      Showing {recentLogs.length} entries
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {recentLogs.map((log) => {
                      const recordedDate = log.recorded_at ? new Date(log.recorded_at) : null;
                      const dateStr = recordedDate
                        ? recordedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + recordedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                        : "Unknown";
                      return (
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
                              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.secondary }}>{dateStr}</span>
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
                              {log.label}
                            </span>
                          </div>

                          {/* Vitals */}
                          <div style={{ flex: 1, display: "flex", gap: 24 }}>
                            {log.bp_systolic != null && (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.7rem", color: colors.secondary, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>BP</span>
                                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{log.bp_systolic}/{log.bp_diastolic}</span>
                              </div>
                            )}
                            {log.heart_rate != null && (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.7rem", color: colors.secondary, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>HR</span>
                                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{log.heart_rate}</span>
                              </div>
                            )}
                            {log.temperature != null && (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.7rem", color: colors.secondary, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>Temp</span>
                                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{log.temperature}</span>
                              </div>
                            )}
                            {log.spo2 != null && (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: "0.7rem", color: colors.secondary, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>SpO₂</span>
                                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{log.spo2}%</span>
                              </div>
                            )}
                          </div>

                          {/* Note */}
                          {log.notes && (
                            <div style={{ maxWidth: 200 }}>
                              <p style={{ fontSize: "0.8rem", color: colors.secondary, margin: 0, fontStyle: "italic" }}>
                                "{log.notes}"
                              </p>
                            </div>
                          )}

                          <ChevronRight size={18} color={colors.secondary} style={{ opacity: 0.4 }} />
                        </div>
                      );
                    })}
                    {recentLogs.length === 0 && (
                      <p style={{ fontSize: "0.85rem", color: colors.secondary, textAlign: "center", padding: "40px 0" }}>No vital logs recorded yet.</p>
                    )}
                  </div>
                </section>
              </>
            )}

          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
