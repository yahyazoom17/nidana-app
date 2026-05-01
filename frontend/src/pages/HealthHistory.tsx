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
    Volume2,
    VolumeX,
    Calendar,
    Search,
    Download,
    Filter,
    CheckCircle2,
    Mic2
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
    ai: "#9333EA", // Purple for AI
};

/* ─── Nav Items ─── */
const navItems = [
    { label: "Health Monitor", icon: Activity, href: "/health-monitor" },
    { label: "Ayush AI", icon: BrainCircuit, href: "/chatbot" },
    { label: "Health History", icon: History, href: "/history", active: true },
    { label: "Women Health", icon: Flower2, href: "/women-health" },
];

/* ─── Mock Data ─── */
const historyItems = [
    {
        id: 1,
        type: "report",
        title: "Annual Physical Exam",
        date: "Dec 12, 2025",
        summary: "All vitals normal. Cholesterol slightly elevated.",
        doctor: "Dr. Smith",
        icon: FileText,
        color: colors.info
    },
    {
        id: 2,
        type: "medication",
        title: "Completed: Amoxicillin Course",
        date: "Nov 20, 2025",
        summary: "10-day course for sinus infection. Fully adhered.",
        doctor: "Self-Reported",
        icon: Pill,
        color: colors.tertiary
    },
    {
        id: 3,
        type: "report",
        title: "Blood Glucose Log (Q3)",
        date: "Oct 15, 2025",
        summary: "Average 105 mg/dL. Stable trend observed.",
        doctor: "AI Generated",
        icon: Activity,
        color: colors.ai
    },
    {
        id: 4,
        type: "report",
        title: "Cardiac Stress Test",
        date: "Aug 05, 2025",
        summary: "Negative for ischemia. Good exercise tolerance.",
        doctor: "Dr. Chen",
        icon: TrendingUp,
        color: colors.alert
    },
];

const aiReviewText = "Based on your health history from the past year, your overall wellness trend is positive. Your glucose management has improved by 15% since October. However, your cholesterol levels in December suggest we should monitor your dietary saturated fats. Your adherence to the Amoxicillin course in November was excellent, which prevented any secondary infections. I recommend focusing on heart-healthy fats this coming quarter.";

export default function HealthHistory() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleVoiceOutput = () => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(aiReviewText);
                utterance.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        } else {
            alert("Voice output is not supported in your browser.");
        }
    };

    const filteredHistory = historyItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            id="health-history-page"
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
                                    Health History
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
                                Explore your medical records and AI-driven historical analysis.
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ position: "relative" }}>
                                <Search size={18} color={colors.secondary} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: "10px 16px 10px 40px",
                                        borderRadius: 12,
                                        border: `1px solid ${colors.secondary}30`,
                                        background: colors.neutral,
                                        fontSize: "0.875rem",
                                        width: 240,
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <button
                                style={{
                                    background: colors.surface,
                                    color: colors.primary,
                                    padding: "10px 20px",
                                    borderRadius: 12,
                                    border: `1px solid ${colors.secondary}30`,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                <Filter size={18} /> Filters
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
                        {/* AI Review Card */}
                        <section>
                            <div style={{
                                background: `linear-gradient(135deg, ${colors.ai} 0%, #6D28D9 100%)`,
                                borderRadius: 24,
                                padding: "32px",
                                color: colors.onPrimary,
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.2)"
                            }}>
                                <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.1 }}>
                                    <BrainCircuit size={200} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                                    <div style={{ maxWidth: "70%" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                            <div style={{ background: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 10 }}>
                                                <Sparkles size={20} color={colors.onPrimary} />
                                            </div>
                                            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>AI Historical Review</h3>
                                        </div>
                                        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.95, margin: 0 }}>
                                            {aiReviewText}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        <button
                                            onClick={handleVoiceOutput}
                                            style={{
                                                background: colors.onPrimary,
                                                color: colors.ai,
                                                padding: "12px 24px",
                                                borderRadius: 14,
                                                border: "none",
                                                fontWeight: 700,
                                                fontSize: "0.9rem",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }}
                                        >
                                            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                            {isSpeaking ? "Stop Voice" : "Listen Review"}
                                        </button>
                                        <button
                                            style={{
                                                background: "rgba(255,255,255,0.1)",
                                                color: colors.onPrimary,
                                                padding: "12px 24px",
                                                borderRadius: 14,
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                fontWeight: 600,
                                                fontSize: "0.9rem",
                                                cursor: "pointer",
                                                backdropFilter: "blur(10px)"
                                            }}
                                        >
                                            Download Full Analysis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Timeline Section */}
                        <section>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Health Timeline</h3>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <span style={{ fontSize: "0.85rem", color: colors.secondary }}>Sorted by: <b>Newest First</b></span>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
                                {/* Vertical Line */}
                                <div style={{
                                    position: "absolute",
                                    left: 20,
                                    top: 24,
                                    bottom: 24,
                                    width: 2,
                                    background: `${colors.secondary}20`,
                                    zIndex: 0
                                }} />

                                {filteredHistory.map((item, index) => (
                                    <div key={item.id} style={{ display: "flex", gap: 24, paddingBottom: 40, position: "relative", zIndex: 1 }}>
                                        {/* Icon / Point */}
                                        <div style={{
                                            minWidth: 42,
                                            height: 42,
                                            borderRadius: "50%",
                                            background: colors.surface,
                                            border: `4px solid ${item.color}30`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                        }}>
                                            <item.icon size={18} color={item.color} />
                                        </div>

                                        {/* Card */}
                                        <div style={{
                                            flex: 1,
                                            background: colors.surface,
                                            borderRadius: 20,
                                            padding: "24px",
                                            border: `1px solid ${colors.secondary}15`,
                                            boxShadow: `0 4px 15px ${colors.secondary}08`,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 12,
                                            transition: "transform 0.2s ease",
                                            cursor: "pointer"
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                        <Calendar size={14} color={colors.secondary} />
                                                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.secondary }}>{item.date}</span>
                                                    </div>
                                                    <h4 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>{item.title}</h4>
                                                </div>
                                                <div style={{ display: "flex", gap: 10 }}>
                                                    <button style={{ padding: 8, borderRadius: 10, background: colors.neutral, border: "none", cursor: "pointer", color: colors.secondary }}>
                                                        <Download size={16} />
                                                    </button>
                                                    <button style={{ padding: 8, borderRadius: 10, background: colors.neutral, border: "none", cursor: "pointer", color: colors.secondary }}>
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <p style={{ fontSize: "0.95rem", color: colors.secondary, lineHeight: 1.6, margin: 0 }}>
                                                {item.summary}
                                            </p>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${colors.tertiary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <CheckCircle2 size={12} color={colors.tertiary} />
                                                    </div>
                                                    <span style={{ fontSize: "0.85rem", color: colors.secondary }}>{item.doctor}</span>
                                                </div>
                                                {item.type === "medication" && (
                                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: colors.tertiary, background: `${colors.tertiary}10`, padding: "4px 10px", borderRadius: 20 }}>
                                                        Medication Cycle
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Bottom Insight Footer */}
                        <div style={{
                            background: colors.surface,
                            borderRadius: 24,
                            padding: "24px 32px",
                            border: `1px solid ${colors.secondary}15`,
                            display: "flex",
                            alignItems: "center",
                            gap: 20
                        }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${colors.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Mic2 size={24} color={colors.accent} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h5 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 4px 0" }}>Need a verbal summary?</h5>
                                <p style={{ fontSize: "0.85rem", color: colors.secondary, margin: 0 }}>Click the "Listen Review" button above to hear a comprehensive AI analysis of your health journey.</p>
                            </div>
                            <button
                                onClick={handleVoiceOutput}
                                style={{
                                    padding: "12px 24px",
                                    borderRadius: 12,
                                    border: `1px solid ${colors.accent}`,
                                    background: "none",
                                    color: colors.accent,
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}>
                                Speak Now
                            </button>
                        </div>

                    </div>
                </ScrollArea>
            </main>
        </div>
    );
}
