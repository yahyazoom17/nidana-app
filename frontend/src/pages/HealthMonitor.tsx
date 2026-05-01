import { useState } from "react";
import {
  Flower2,
  BrainCircuit,
  History,
  Activity,
  Leaf,
  Pill,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Droplets,
  Timer,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ─── Design Tokens ─── */
const colors = {
  primary: "#1B3A2E", // Deep forest green
  secondary: "#7A8F85", // Sage gray
  tertiary: "#4E8B6A", // Muted emerald
  neutral: "#F4F7F4", // Off-white/cream
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
  accent: "#D4AF37", // Muted Gold
  alert: "#E28E93", // Soft red
  info: "#8EADE2", // Soft blue
  ai: "#9333EA", // Purple for AI elements
};

/* ─── Nav Items ─── */
const navItems = [
  { label: "Health Monitor", icon: Activity, href: "/health-monitor", active: true },
  { label: "Ayush AI", icon: BrainCircuit, href: "/chatbot" },
  { label: "Health History", icon: History, href: "/history" },
  { label: "Women Health", icon: Flower2, href: "/women-health" },
];

/* ─── Mock Data ─── */
const medications = [
  { 
    id: 1, 
    name: "Metformin", 
    dosage: "500mg", 
    schedule: "Twice daily", 
    nextDose: "08:00 PM", 
    status: "Upcoming",
    aiInsight: "Optimized for post-meal absorption.",
    riskLevel: "Low"
  },
  { 
    id: 2, 
    name: "Atorvastatin", 
    dosage: "20mg", 
    schedule: "Once daily", 
    nextDose: "Taken", 
    status: "Completed",
    aiInsight: "Evening dose recommended for efficacy.",
    riskLevel: "Low"
  },
  { 
    id: 3, 
    name: "Vitamin D3", 
    dosage: "2000 IU", 
    schedule: "Daily", 
    nextDose: "09:00 AM", 
    status: "Scheduled",
    aiInsight: "Paired with morning light for synergy.",
    riskLevel: "None"
  },
];

const healthMetrics = [
  { id: 1, label: "Blood Sugar", value: "98", unit: "mg/dL", trend: "improving", icon: Droplets, color: colors.info },
  { id: 2, label: "Sleep Quality", value: "88", unit: "%", trend: "good", icon: Timer, color: colors.tertiary },
];

export default function HealthMonitor() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div
      id="health-monitor-page"
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
              justifyContent: "space-between",
            }}
          >
            <div>
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
                    background: colors.ai,
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
                  Health Sanctuary
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
                AI-managed health tracking and personalized prescription optimization.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                <button
                style={{
                    background: `${colors.ai}15`,
                    color: colors.ai,
                    padding: "10px 20px",
                    borderRadius: 12,
                    border: `1px solid ${colors.ai}30`,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                }}
                >
                <Sparkles size={18} /> AI Sync
                </button>
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
                <Plus size={18} /> Update Data
                </button>
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <ScrollArea className="flex-1" style={{ background: colors.neutral }}>
          <div
            style={{
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* AI Prescription Management Section */}
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                 <div style={{ padding: 10, background: `${colors.ai}10`, borderRadius: 12 }}>
                    <ShieldCheck size={24} color={colors.ai} />
                 </div>
                 <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>AI Managed Prescriptions</h3>
                    <p style={{ fontSize: "0.85rem", color: colors.secondary, margin: 0 }}>Active optimization for 3 medications</p>
                 </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                {medications.map((med) => (
                  <div
                    key={med.id}
                    style={{
                      background: colors.surface,
                      borderRadius: 24,
                      padding: "24px",
                      boxShadow: `0 4px 20px ${colors.secondary}08`,
                      border: `1px solid ${colors.secondary}10`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Header Info */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ 
                            width: 52, 
                            height: 52, 
                            borderRadius: 16, 
                            background: colors.neutral, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                        }}>
                          <Pill size={26} color={colors.tertiary} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{med.name}</h4>
                          <span style={{ fontSize: "0.85rem", color: colors.secondary }}>{med.dosage} • {med.schedule}</span>
                        </div>
                      </div>
                      <div style={{ 
                        background: med.status === "Completed" ? "#E8F5E9" : "#FFF9C4", 
                        padding: "4px 12px", 
                        borderRadius: 20,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: med.status === "Completed" ? "#2E7D32" : "#F57F17"
                      }}>
                        {med.status}
                      </div>
                    </div>

                    {/* AI Insight Card */}
                    <div style={{ 
                        background: `linear-gradient(135deg, ${colors.ai}08 0%, ${colors.ai}04 100%)`, 
                        borderRadius: 16, 
                        padding: "16px",
                        border: `1px solid ${colors.ai}15`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Sparkles size={14} color={colors.ai} />
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: colors.ai, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Managed Insight</span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: colors.primary, fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
                            {med.aiInsight}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <Zap size={12} color={colors.accent} />
                                <span style={{ fontSize: "0.75rem", color: colors.secondary }}>Adherence: 98%</span>
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: colors.tertiary }}>Next: {med.nextDose}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={{ 
                            flex: 1, 
                            padding: "10px", 
                            borderRadius: 12, 
                            border: `1px solid ${colors.secondary}20`, 
                            background: "none",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: colors.secondary,
                            cursor: "pointer"
                        }}>Details</button>
                        <button style={{ 
                            flex: 1.5, 
                            padding: "10px", 
                            borderRadius: 12, 
                            border: "none", 
                            background: colors.primary,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: colors.onPrimary,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6
                        }}>
                           <CheckCircle2 size={16} /> Mark Taken
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vitals & Health Trends Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32 }}>
               
               {/* Health Reports & Vitals Summary */}
               <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                   <section>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>Health Indicators</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {healthMetrics.map(metric => (
                                <div key={metric.id} style={{ background: colors.surface, padding: "20px", borderRadius: 20, border: `1px solid ${colors.secondary}15`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ padding: 10, background: `${metric.color}15`, borderRadius: 12 }}>
                                            <metric.icon size={20} color={metric.color} />
                                        </div>
                                        <div>
                                            <span style={{ fontSize: "0.8rem", color: colors.secondary, fontWeight: 500 }}>{metric.label}</span>
                                            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                                <h4 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{metric.value}</h4>
                                                <span style={{ fontSize: "0.8rem", color: colors.secondary }}>{metric.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ height: 40, width: 80, background: `${metric.color}08`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <TrendingUp size={16} color={metric.color} />
                                    </div>
                                </div>
                            ))}
                        </div>
                   </section>

                   <section>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>Upcoming Consultations</h3>
                      <div style={{ background: `linear-gradient(to right, ${colors.primary}, #2A5A46)`, padding: "20px", borderRadius: 20, color: colors.onPrimary }}>
                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Specialist Visit</span>
                            <span style={{ fontSize: "0.8rem", fontWeight: 600, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 4 }}>Tomorrow</span>
                         </div>
                         <h4 style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0 0 4px 0" }}>Dr. Emily Watson</h4>
                         <p style={{ fontSize: "0.85rem", opacity: 0.9, margin: 0 }}>Endocrinology • 10:30 AM</p>
                         <button style={{ width: "100%", marginTop: 16, padding: "10px", borderRadius: 10, border: "none", background: colors.onPrimary, color: colors.primary, fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>Join Call</button>
                      </div>
                   </section>
               </div>

               {/* AI Health Trends Analysis */}
               <section>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>AI Trend Analysis</h3>
                    <span style={{ fontSize: "0.85rem", color: colors.ai, fontWeight: 600 }}>Last Sync: 2 mins ago</span>
                  </div>
                  <div style={{ background: colors.surface, borderRadius: 24, padding: "32px", border: `1px solid ${colors.secondary}15`, minHeight: 300, display: "flex", flexDirection: "column", gap: 24 }}>
                     <div style={{ flex: 1, borderBottom: `1px solid ${colors.secondary}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                         <div style={{ textAlign: "center" }}>
                            <BrainCircuit size={48} color={colors.ai} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p style={{ color: colors.secondary, fontSize: "0.9rem" }}>AI is generating long-term health projections based on your medication adherence and vitals...</p>
                         </div>
                     </div>
                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.tertiary}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ArrowUpRight size={20} color={colors.tertiary} />
                            </div>
                            <div>
                                <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 2px 0" }}>Glycemic Stability</h5>
                                <p style={{ fontSize: "0.85rem", color: colors.secondary, margin: 0 }}>Your glucose levels have stabilized by 12% since the AI-optimized Metformin schedule started.</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.info}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Zap size={20} color={colors.info} />
                            </div>
                            <div>
                                <h5 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 2px 0" }}>Recovery Efficiency</h5>
                                <p style={{ fontSize: "0.85rem", color: colors.secondary, margin: 0 }}>Sleep quality correlation suggests that Vitamin D3 intake in the morning is improving REM cycles.</p>
                            </div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>

          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
