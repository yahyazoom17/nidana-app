import { useState, useRef, useEffect } from "react";
import {
  Flower2,
  BrainCircuit,
  HeartPulse,
  History,
  Send,
  Leaf,
  Bot,
  Mic,
  MicOff,
  Plus,
  Image as ImageIcon,
  Camera,
  FileText,
  ChevronDown,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ─── Design Tokens from DESIGN.md ─── */
const colors = {
  primary: "#1B3A2E",
  secondary: "#7A8F85",
  tertiary: "#4E8B6A",
  neutral: "#F4F7F4",
  surface: "#FFFFFF",
  onPrimary: "#FFFFFF",
};

/* ─── Types ─── */
interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
}

/* ─── API Helper ─── */
const API_BASE = "/api/chatbot";

function extractResponseText(response: any): string {
  if (!response) return "I'm sorry, I couldn't generate a response.";
  // CrewAI returns a CrewOutput object — the text is in .raw
  if (typeof response === "string") return response;
  if (response.raw) return String(response.raw);
  if (response.result) return String(response.result);
  if (response.output) return String(response.output);
  return JSON.stringify(response);
}

/* ─── Nav Items ─── */
const navItems = [
  { label: "Health Monitor", icon: Flower2, href: "/sanctuary" },
  { label: "Ayush AI", icon: BrainCircuit, href: "/chatbot", active: true },
  { label: "Lifestyle Tracker", icon: History, href: "/history" },
  { label: "Vital Logs", icon: Activity, href: "/women-health" },
];

/* ─── Seed Messages ─── */
const seedMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Good morning. I am your Clinical Wellness Guide. How are you feeling today? I am here to discuss your current symptoms, review your recent vitals, or simply provide a calm space for health reflections.",
  },
  {
    id: "2",
    role: "user",
    content:
      "I've been experiencing mild headaches in the late afternoon for the past two days. Could it be related to my new medication schedule?",
  },
  {
    id: "3",
    role: "ai",
    content:
      "Thank you for sharing that observation. Mild afternoon headaches can sometimes occur as your body adjusts to a new medication schedule.",
  },
  {
    id: "4",
    role: "ai",
    content:
      "Let's review your recent logs. I note your hydration levels were slightly below target yesterday. Before we consider the medication as the primary cause, I recommend drinking a glass of water and resting for 15 minutes in a quiet environment.",
  },
];

const chatHistorySessions = [
  { id: "h1", title: "Headache Discussion", date: "Today" },
  { id: "h2", title: "Dietary Plan", date: "Yesterday" },
  { id: "h3", title: "Sleep Habits", date: "Last Week" },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachments(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `[Attached file: ${file.name}]`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Choose endpoint based on file type
      const isPdf = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");
      let endpoint = `${API_BASE}/upload-pdf`; // default
      if (isImage) endpoint = `${API_BASE}/upload-image`;
      else if (isPdf) endpoint = `${API_BASE}/upload-pdf`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.status === "ok") {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: extractResponseText(data.response),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.error || "Sorry, I could not process that file. Please try again.",
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (err) {
      console.error("File upload error:", err);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm having trouble connecting to the server. Please check that the backend is running and try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      // Reset the input so re-uploading the same file triggers onChange
      e.target.value = "";
    }
  };

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const query = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: extractResponseText(data.response),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm having trouble connecting to the server. Please check that the backend is running and try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      id="chatbot-page"
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
        <div
          style={{
            padding: "0 24px",
            marginBottom: 40,
          }}
        >
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
                  fontFamily: "'DM Sans', sans-serif",
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
              <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <a
                  href={item.href}
                  id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                      e.currentTarget.style.background = `${colors.neutral}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon
                      size={18}
                      color={isActive ? colors.tertiary : colors.secondary}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    {item.label}
                  </div>
                  {item.href === "/chatbot" && (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setIsHistoryOpen(!isHistoryOpen);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 4,
                        marginRight: -4,
                        borderRadius: 6,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${colors.secondary}20`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {isHistoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  )}
                </a>
                {item.href === "/chatbot" && isHistoryOpen && (
                  <div
                    style={{
                      paddingLeft: 42,
                      paddingRight: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      marginTop: 2,
                      marginBottom: 8,
                    }}
                  >
                    {chatHistorySessions.map((session) => (
                      <div
                        key={session.id}
                        style={{
                          fontSize: "0.8rem",
                          color: colors.secondary,
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: 6,
                          transition: "background 0.15s ease",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = colors.neutral)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        title={session.title}
                      >
                        {session.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div style={{ padding: "0 12px" }}>
          <Separator
            style={{ background: `${colors.secondary}20`, marginBottom: 16, marginLeft: 12, marginRight: 12 }}
          />
          <a
            href="/personal-info"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              color: colors.primary,
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.neutral)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Avatar style={{ width: 32, height: 32 }}>
              <AvatarFallback style={{ background: `${colors.tertiary}20`, color: colors.tertiary, fontSize: "0.85rem", fontWeight: 600 }}>JD</AvatarFallback>
            </Avatar>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.2 }}>Jane Doe</span>
              <span style={{ fontSize: "0.75rem", color: colors.secondary }}>View Profile</span>
            </div>
          </a>
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
          id="chat-header"
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
                background: colors.tertiary,
              }}
            />
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 500,
                margin: 0,
                color: colors.primary,
                lineHeight: 1.25,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Ayush - Your Personal AI Doc
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: colors.secondary,
              lineHeight: 1.65,
              marginLeft: 20,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Your clinical AI assistant. Ask questions and receive calm, measured
            guidance.
          </p>
        </header>

        {/* Chat Area */}
        <ScrollArea
          className="flex-1"
          style={{ background: colors.neutral }}
        >
          <div
            ref={scrollRef}
            id="messages-container"
            style={{
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              minHeight: "100%",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* AI Avatar */}
                {msg.role === "ai" && (
                  <Avatar
                    size="default"
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <AvatarFallback
                      style={{
                        background: colors.primary,
                        color: colors.onPrimary,
                      }}
                    >
                      <Bot size={16} />
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Message Bubble */}
                <div
                  style={{
                    maxWidth: "65%",
                    padding: "14px 20px",
                    borderRadius:
                      msg.role === "ai"
                        ? "4px 16px 16px 16px"
                        : "16px 4px 16px 16px",
                    background:
                      msg.role === "ai" ? colors.surface : colors.primary,
                    color:
                      msg.role === "ai" ? colors.primary : colors.onPrimary,
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow:
                      msg.role === "ai"
                        ? `0 1px 3px ${colors.secondary}15`
                        : "none",
                    border:
                      msg.role === "ai"
                        ? `1px solid ${colors.secondary}20`
                        : "none",
                  }}
                >
                  {msg.role === "ai" ? (
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <Avatar
                    size="default"
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <AvatarFallback
                      style={{
                        background: colors.tertiary,
                        color: colors.onPrimary,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Y
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  size="default"
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  <AvatarFallback
                    style={{
                      background: colors.primary,
                      color: colors.onPrimary,
                    }}
                  >
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div
                  style={{
                    maxWidth: "65%",
                    padding: "14px 20px",
                    borderRadius: "4px 16px 16px 16px",
                    background: colors.surface,
                    border: `1px solid ${colors.secondary}20`,
                    boxShadow: `0 1px 3px ${colors.secondary}15`,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: colors.tertiary,
                      animation: "pulse 1.4s infinite ease-in-out",
                      animationDelay: "0s",
                    }}
                  />
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: colors.tertiary,
                      animation: "pulse 1.4s infinite ease-in-out",
                      animationDelay: "0.2s",
                    }}
                  />
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: colors.tertiary,
                      animation: "pulse 1.4s infinite ease-in-out",
                      animationDelay: "0.4s",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div
          id="chat-input-area"
          style={{
            padding: "16px 40px 24px",
            background: colors.surface,
            borderTop: `1px solid ${colors.secondary}20`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: colors.neutral,
              borderRadius: 16,
              padding: "6px 6px 6px 12px",
              border: `1px solid ${colors.secondary}30`,
              transition: "border-color 0.15s ease",
              position: "relative",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${colors.tertiary}60`;
            }}
            onBlur={(e) => {
              setTimeout(() => {
                e.currentTarget.style.borderColor = `${colors.secondary}30`;
              }, 150);
            }}
          >
            {/* Attachment Button & Menu */}
            <div style={{ position: "relative" }}>
              <Button
                onClick={() => setShowAttachments((prev) => !prev)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: showAttachments ? `${colors.primary}15` : "transparent",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <Plus
                  size={20}
                  color={colors.secondary}
                  style={{
                    transform: showAttachments ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </Button>

              {showAttachments && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 12px)",
                    left: 0,
                    background: colors.surface,
                    border: `1px solid ${colors.secondary}30`,
                    borderRadius: 12,
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    boxShadow: `0 4px 12px ${colors.secondary}20`,
                    zIndex: 10,
                    minWidth: 140,
                  }}
                >
                  <button
                    onClick={() => galleryRef.current?.click()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: colors.primary,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = colors.neutral)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <ImageIcon size={16} color={colors.secondary} />
                    Gallery
                  </button>
                  <button
                    onClick={() => cameraRef.current?.click()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: colors.primary,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = colors.neutral)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Camera size={16} color={colors.secondary} />
                    Camera
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: colors.primary,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = colors.neutral)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <FileText size={16} color={colors.secondary} />
                    Files
                  </button>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                type="file"
                accept="image/*"
                ref={galleryRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="*/*"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe how you're feeling…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                color: colors.primary,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <Button
              onClick={toggleListening}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: isListening ? `${colors.primary}15` : "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                padding: 0,
                flexShrink: 0,
                marginRight: 4,
              }}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <MicOff size={18} color={colors.primary} />
              ) : (
                <Mic size={18} color={colors.secondary} />
              )}
            </Button>
            <Button
              id="send-button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: input.trim() ? colors.tertiary : `${colors.secondary}30`,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() ? "pointer" : "default",
                transition: "background 0.15s ease",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <Send
                size={18}
                color={input.trim() ? colors.onPrimary : colors.secondary}
              />
            </Button>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.7rem",
              color: colors.secondary,
              marginTop: 10,
              letterSpacing: "0.04em",
            }}
          >
            Nidana provides general wellness guidance. Always consult your
            healthcare provider.
          </p>
        </div>
      </main>
    </div>
  );
}
