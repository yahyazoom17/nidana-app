import { useState } from "react";
import {
  Leaf, BrainCircuit, Activity, Heart, Footprints,
  Bot, Clock, Search, Trash2, ChevronRight,
  MessageSquare, Calendar, ArrowLeft, Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const colors = {
  primary: "#1B3A2E",
  secondary: "#7A8F85",
  tertiary: "#4E8B6A",
  neutral: "#F4F7F4",
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
  accent: "#D4AF37",
  ai: "#9333EA",
};

const navItems = [
  { label: "Health Monitor", icon: Activity, href: "/health-monitor" },
  { label: "Ayush AI", icon: BrainCircuit, href: "/chatbot" },
  { label: "Lifestyle Tracker", icon: Heart, href: "/lifestyle" },
  { label: "Vital Logs", icon: Footprints, href: "/vital-logs" },
];

interface ConversationPreview {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  time: string;
  messageCount: number;
  tags: string[];
}

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  time: string;
}

const conversations: ConversationPreview[] = [
  {
    id: "c1",
    title: "Afternoon Headache Consultation",
    lastMessage: "I recommend drinking a glass of water and resting for 15 minutes in a quiet environment.",
    date: "Today",
    time: "2:30 PM",
    messageCount: 4,
    tags: ["Symptoms", "Medication"],
  },
  {
    id: "c2",
    title: "Sleep Quality Analysis",
    lastMessage: "Your REM sleep has improved by 18% since adjusting your evening routine. Keep maintaining the 10:30 PM bedtime.",
    date: "Yesterday",
    time: "9:15 PM",
    messageCount: 6,
    tags: ["Sleep", "Wellness"],
  },
  {
    id: "c3",
    title: "Nutrition & Hydration Review",
    lastMessage: "Based on your logs, increasing your afternoon water intake by 2 glasses could help reduce fatigue symptoms.",
    date: "Apr 30",
    time: "4:45 PM",
    messageCount: 8,
    tags: ["Nutrition", "Hydration"],
  },
  {
    id: "c4",
    title: "Blood Pressure Follow-up",
    lastMessage: "Your blood pressure readings over the past week show excellent stability. Continue your current regimen.",
    date: "Apr 28",
    time: "10:00 AM",
    messageCount: 5,
    tags: ["Vitals", "BP"],
  },
  {
    id: "c5",
    title: "Exercise Plan Discussion",
    lastMessage: "A combination of 30-minute walks and light yoga would be ideal given your current health profile.",
    date: "Apr 26",
    time: "11:30 AM",
    messageCount: 7,
    tags: ["Exercise", "Wellness"],
  },
];

const conversationMessages: Record<string, Message[]> = {
  c1: [
    { id: "1", role: "ai", time: "2:30 PM", content: "Good afternoon. I am your Clinical Wellness Guide. How are you feeling today?" },
    { id: "2", role: "user", time: "2:31 PM", content: "I've been experiencing mild headaches in the late afternoon for the past two days. Could it be related to my new medication schedule?" },
    { id: "3", role: "ai", time: "2:31 PM", content: "Thank you for sharing that observation. Mild afternoon headaches can sometimes occur as your body adjusts to a new medication schedule." },
    { id: "4", role: "ai", time: "2:32 PM", content: "Let's review your recent logs. I note your hydration levels were slightly below target yesterday. Before we consider the medication as the primary cause, I recommend drinking a glass of water and resting for 15 minutes in a quiet environment." },
  ],
  c2: [
    { id: "1", role: "ai", time: "9:15 PM", content: "Good evening. I've analyzed your sleep data from the past week. Would you like to review the insights?" },
    { id: "2", role: "user", time: "9:16 PM", content: "Yes please. I've been trying to improve my sleep schedule." },
    { id: "3", role: "ai", time: "9:16 PM", content: "Great effort! Your average sleep duration increased from 6.2 to 7.5 hours. Deep sleep phases are also longer." },
    { id: "4", role: "user", time: "9:17 PM", content: "That's encouraging! What about REM sleep?" },
    { id: "5", role: "ai", time: "9:17 PM", content: "Your REM sleep has improved by 18% since adjusting your evening routine. Keep maintaining the 10:30 PM bedtime." },
    { id: "6", role: "user", time: "9:18 PM", content: "Will do, thanks for the analysis!" },
  ],
  c3: [
    { id: "1", role: "ai", time: "4:45 PM", content: "I've reviewed your nutrition and hydration logs for this week. There are some patterns I'd like to discuss." },
    { id: "2", role: "user", time: "4:46 PM", content: "Sure, what did you find?" },
    { id: "3", role: "ai", time: "4:46 PM", content: "Your calorie intake is well-balanced, averaging 1,850 kcal daily. However, your water intake drops significantly after 3 PM." },
    { id: "4", role: "user", time: "4:47 PM", content: "I do tend to forget to drink water in the afternoon." },
    { id: "5", role: "ai", time: "4:47 PM", content: "Based on your logs, increasing your afternoon water intake by 2 glasses could help reduce fatigue symptoms." },
  ],
};

const tagColors: Record<string, string> = {
  Symptoms: "#E28E93",
  Medication: "#8EADE2",
  Sleep: "#6366F1",
  Wellness: "#4E8B6A",
  Nutrition: "#F59E0B",
  Hydration: "#3B82F6",
  Vitals: "#EF4444",
  BP: "#E28E93",
  Exercise: "#10B981",
};

export default function ConversationhistoryPage() {
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeMessages = selectedConvo ? conversationMessages[selectedConvo] : null;
  const activeConvo = conversations.find((c) => c.id === selectedConvo);

  return (
    <div id="conversation-history-page" style={{ display: "flex", height: "100vh", width: "100%", fontFamily: "'DM Sans', sans-serif", background: colors.neutral, color: colors.primary }}>
      {/* Sidebar */}
      <aside style={{ width: 260, minWidth: 260, display: "flex", flexDirection: "column", background: colors.surface, borderRight: `1px solid ${colors.secondary}33`, padding: "32px 0 24px" }}>
        <div style={{ padding: "0 24px", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={20} color={colors.onPrimary} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.125rem", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2, margin: 0 }}>Nidana</h1>
              <span style={{ fontSize: "0.7rem", fontWeight: 500, color: colors.secondary, letterSpacing: "0.06em", textTransform: "uppercase" }}>wellness guide</span>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, fontSize: "0.875rem", fontWeight: 400, color: colors.secondary, background: "transparent", textDecoration: "none", transition: "all 0.15s ease" }}>
                <Icon size={18} color={colors.secondary} strokeWidth={1.5} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: "0 24px" }}>
          <Separator style={{ background: `${colors.secondary}20`, marginBottom: 16 }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 500, color: colors.secondary, letterSpacing: "0.06em", textTransform: "uppercase" }}>Clinic Sage v1.0</span>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <header style={{ padding: "28px 40px 20px", background: colors.surface, borderBottom: `1px solid ${colors.secondary}20` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.ai }} />
                <h2 style={{ fontSize: "2rem", fontWeight: 500, margin: 0, lineHeight: 1.25 }}>Conversation History</h2>
              </div>
              <p style={{ fontSize: "0.9rem", color: colors.secondary, marginLeft: 20 }}>Review past consultations with Ayush AI.</p>
            </div>
            <a href="/chatbot" style={{ background: colors.primary, color: colors.onPrimary, padding: "10px 20px", borderRadius: 12, border: "none", display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", textDecoration: "none", boxShadow: "0 4px 12px rgba(27, 58, 46, 0.15)" }}>
              <MessageSquare size={18} /> New Chat
            </a>
          </div>
        </header>

        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Conversation List */}
          <div style={{ width: selectedConvo ? 360 : "100%", maxWidth: selectedConvo ? 360 : 720, borderRight: selectedConvo ? `1px solid ${colors.secondary}15` : "none", display: "flex", flexDirection: "column", transition: "width 0.3s ease", margin: selectedConvo ? 0 : "0 auto" }}>
            {/* Search Bar */}
            <div style={{ padding: "20px 24px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: colors.neutral, borderRadius: 12, padding: "10px 16px", border: `1px solid ${colors.secondary}20` }}>
                <Search size={16} color={colors.secondary} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.85rem", color: colors.primary, fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div style={{ padding: "0 12px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
                {filteredConversations.map((convo) => (
                  <div
                    key={convo.id}
                    onClick={() => setSelectedConvo(convo.id)}
                    style={{
                      padding: "16px",
                      borderRadius: 16,
                      cursor: "pointer",
                      background: selectedConvo === convo.id ? `${colors.tertiary}10` : colors.surface,
                      border: selectedConvo === convo.id ? `1px solid ${colors.tertiary}30` : `1px solid transparent`,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (selectedConvo !== convo.id) e.currentTarget.style.background = colors.neutral; }}
                    onMouseLeave={(e) => { if (selectedConvo !== convo.id) e.currentTarget.style.background = colors.surface; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0, lineHeight: 1.3, flex: 1, marginRight: 12 }}>{convo.title}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <Clock size={12} color={colors.secondary} />
                        <span style={{ fontSize: "0.7rem", color: colors.secondary, whiteSpace: "nowrap" }}>{convo.date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: colors.secondary, margin: "0 0 10px 0", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {convo.lastMessage}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {convo.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: `${tagColors[tag] || colors.secondary}15`, color: tagColors[tag] || colors.secondary }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MessageSquare size={11} color={colors.secondary} />
                        <span style={{ fontSize: "0.7rem", color: colors.secondary }}>{convo.messageCount}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Search size={32} color={`${colors.secondary}40`} style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: "0.9rem", color: colors.secondary, margin: 0 }}>No conversations found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Conversation Detail Panel */}
          {selectedConvo && activeConvo && activeMessages && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: colors.neutral }}>
              {/* Detail Header */}
              <div style={{ padding: "16px 28px", background: colors.surface, borderBottom: `1px solid ${colors.secondary}15`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setSelectedConvo(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}>
                    <ArrowLeft size={18} color={colors.secondary} />
                  </button>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{activeConvo.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <Calendar size={12} color={colors.secondary} />
                      <span style={{ fontSize: "0.75rem", color: colors.secondary }}>{activeConvo.date} at {activeConvo.time}</span>
                      <span style={{ fontSize: "0.75rem", color: colors.secondary }}>•</span>
                      <span style={{ fontSize: "0.75rem", color: colors.secondary }}>{activeConvo.messageCount} messages</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href="/chatbot" style={{ padding: "8px 16px", borderRadius: 10, background: colors.primary, color: colors.onPrimary, fontSize: "0.8rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={14} /> Continue Chat
                  </a>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1">
                <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {activeMessages.map((msg) => (
                    <div key={msg.id} style={{ display: "flex", gap: 12, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      {msg.role === "ai" && (
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          <Bot size={16} color={colors.onPrimary} />
                        </div>
                      )}
                      <div style={{ maxWidth: "65%" }}>
                        <div style={{
                          padding: "14px 18px",
                          borderRadius: msg.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                          background: msg.role === "ai" ? colors.surface : colors.primary,
                          color: msg.role === "ai" ? colors.primary : colors.onPrimary,
                          fontSize: "0.88rem",
                          lineHeight: 1.6,
                          boxShadow: msg.role === "ai" ? `0 1px 3px ${colors.secondary}15` : "none",
                          border: msg.role === "ai" ? `1px solid ${colors.secondary}20` : "none",
                        }}>
                          {msg.content}
                        </div>
                        <span style={{ fontSize: "0.65rem", color: colors.secondary, marginTop: 4, display: "block", textAlign: msg.role === "user" ? "right" : "left", paddingLeft: msg.role === "ai" ? 4 : 0, paddingRight: msg.role === "user" ? 4 : 0 }}>
                          {msg.time}
                        </span>
                      </div>
                      {msg.role === "user" && (
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${colors.tertiary}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: "0.75rem", fontWeight: 600, color: colors.tertiary }}>
                          Y
                        </div>
                      )}
                    </div>
                  ))}

                  {/* AI Summary */}
                  <div style={{ marginTop: 12, background: `${colors.ai}06`, borderRadius: 16, padding: "16px 20px", border: `1px solid ${colors.ai}12` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Sparkles size={14} color={colors.ai} />
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: colors.ai, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Session Summary</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: colors.primary, margin: 0, lineHeight: 1.6 }}>
                      This consultation covered {activeConvo.tags.join(" and ").toLowerCase()} topics.
                      {activeConvo.messageCount} messages were exchanged. Key recommendations were provided and follow-up actions were suggested.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty State when no conversation selected on large view */}
          {!selectedConvo && filteredConversations.length > 0 && (
            <div style={{ flex: 1, display: "none" }} />
          )}
        </div>
      </main>
    </div>
  );
}
