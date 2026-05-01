import { useState } from "react";
import {
  Leaf, BrainCircuit, Activity,
  Droplets, Apple, Moon, Footprints, Heart, Flame,
  Plus, Minus, UtensilsCrossed, Clock, Sun, Sparkles,
  TrendingUp, ChevronRight, Dumbbell, Wind, Coffee,
  GlassWater,
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
  alert: "#E28E93",
  info: "#8EADE2",
  ai: "#9333EA",
  hydration: "#3B82F6",
  nutrition: "#F59E0B",
  sleep: "#6366F1",
  exercise: "#EF4444",
};

const navItems = [
  { label: "Health Monitor", icon: Activity, href: "/health-monitor" },
  { label: "Ayush AI", icon: BrainCircuit, href: "/chatbot" },
  { label: "Lifestyle Tracker", icon: Heart, href: "/lifestyle", active: true },
  { label: "Vital Logs", icon: Footprints, href: "/vital-logs" },
];

const mealPlan = [
  { time: "7:30 AM", label: "Breakfast", icon: Coffee, items: ["Oatmeal with berries", "Green tea", "Almonds (10)"], cal: 420, done: true },
  { time: "1:00 PM", label: "Lunch", icon: UtensilsCrossed, items: ["Grilled chicken salad", "Brown rice", "Lentil soup"], cal: 650, done: true },
  { time: "4:30 PM", label: "Snack", icon: Apple, items: ["Greek yogurt", "Mixed nuts", "Apple slices"], cal: 220, done: false },
  { time: "8:00 PM", label: "Dinner", icon: UtensilsCrossed, items: ["Baked salmon", "Steamed veggies", "Quinoa"], cal: 580, done: false },
];

const exerciseLog = [
  { name: "Morning Walk", duration: "30 min", cal: 150, icon: Footprints, done: true },
  { name: "Yoga Session", duration: "45 min", cal: 200, icon: Wind, done: true },
  { name: "Strength Training", duration: "40 min", cal: 300, icon: Dumbbell, done: false },
];

const sleepData = { hours: 7.5, quality: 85, deep: 2.1, rem: 1.8, light: 3.6, bedtime: "10:30 PM", wakeup: "6:00 AM" };

export default function LifestyleTrackerPage() {
  const [waterGlasses, setWaterGlasses] = useState(5);
  const waterGoal = 8;
  const waterPercent = Math.min((waterGlasses / waterGoal) * 100, 100);
  const totalCalEaten = mealPlan.filter(m => m.done).reduce((s, m) => s + m.cal, 0);
  const totalCalGoal = 1870;
  const totalCalBurned = exerciseLog.filter(e => e.done).reduce((s, e) => s + e.cal, 0);

  return (
    <div id="lifestyle-tracker-page" style={{ display: "flex", height: "100vh", width: "100%", fontFamily: "'DM Sans', sans-serif", background: colors.neutral, color: colors.primary }}>
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
            const isActive = item.active;
            return (
              <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, fontSize: "0.875rem", fontWeight: isActive ? 500 : 400, color: isActive ? colors.primary : colors.secondary, background: isActive ? `${colors.tertiary}14` : "transparent", textDecoration: "none", transition: "all 0.15s ease" }}>
                <Icon size={18} color={isActive ? colors.tertiary : colors.secondary} strokeWidth={isActive ? 2 : 1.5} />
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
        <header style={{ padding: "28px 40px 20px", background: colors.surface, borderBottom: `1px solid ${colors.secondary}20` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.tertiary }} />
                <h2 style={{ fontSize: "2rem", fontWeight: 500, margin: 0, lineHeight: 1.25 }}>Lifestyle Tracker</h2>
              </div>
              <p style={{ fontSize: "0.9rem", color: colors.secondary, marginLeft: 20 }}>Track hydration, nutrition, exercise & sleep for holistic wellness.</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: `${colors.ai}15`, color: colors.ai, padding: "10px 20px", borderRadius: 12, border: `1px solid ${colors.ai}30`, display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                <Sparkles size={18} /> AI Insights
              </button>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1" style={{ background: colors.neutral }}>
          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Summary Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "Hydration", value: `${waterGlasses}/${waterGoal}`, unit: "glasses", icon: GlassWater, color: colors.hydration, pct: waterPercent },
                { label: "Calories In", value: `${totalCalEaten}`, unit: `/ ${totalCalGoal} kcal`, icon: Flame, color: colors.nutrition, pct: (totalCalEaten / totalCalGoal) * 100 },
                { label: "Calories Burned", value: `${totalCalBurned}`, unit: "kcal", icon: Dumbbell, color: colors.exercise, pct: (totalCalBurned / 650) * 100 },
                { label: "Sleep Score", value: `${sleepData.quality}`, unit: "/ 100", icon: Moon, color: colors.sleep, pct: sleepData.quality },
              ].map((c, i) => (
                <div key={i} style={{ background: colors.surface, borderRadius: 20, padding: "20px", border: `1px solid ${colors.secondary}12`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: `${c.pct}%`, height: 3, background: c.color, borderRadius: "0 2px 2px 0", transition: "width 0.5s ease" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", color: colors.secondary, fontWeight: 500 }}>{c.label}</span>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{c.value}</span>
                        <span style={{ fontSize: "0.78rem", color: colors.secondary }}>{c.unit}</span>
                      </div>
                    </div>
                    <div style={{ padding: 10, background: `${c.color}12`, borderRadius: 12 }}>
                      <c.icon size={20} color={c.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              {/* Hydration Tracker */}
              <div style={{ background: colors.surface, borderRadius: 24, padding: "28px", border: `1px solid ${colors.secondary}12` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ padding: 10, background: `${colors.hydration}12`, borderRadius: 12 }}>
                      <Droplets size={22} color={colors.hydration} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Hydration Meter</h3>
                      <span style={{ fontSize: "0.8rem", color: colors.secondary }}>Daily goal: {waterGoal} glasses</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: waterPercent >= 100 ? colors.tertiary : colors.hydration }}>{Math.round(waterPercent)}%</span>
                </div>

                {/* Visual Water Meter */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <div style={{ position: "relative", width: 140, height: 140 }}>
                    <svg viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="70" cy="70" r="60" fill="none" stroke={`${colors.hydration}15`} strokeWidth="10" />
                      <circle cx="70" cy="70" r="60" fill="none" stroke={colors.hydration} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${waterPercent * 3.77} 377`} style={{ transition: "stroke-dasharray 0.5s ease" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <Droplets size={24} color={colors.hydration} />
                      <span style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: 4 }}>{waterGlasses}</span>
                      <span style={{ fontSize: "0.7rem", color: colors.secondary }}>glasses</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                  <button onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${colors.secondary}25`, background: colors.neutral, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Minus size={18} color={colors.secondary} />
                  </button>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Array.from({ length: waterGoal }).map((_, i) => (
                      <div key={i} style={{ width: 12, height: 28, borderRadius: 4, background: i < waterGlasses ? colors.hydration : `${colors.hydration}15`, transition: "background 0.3s ease" }} />
                    ))}
                  </div>
                  <button onClick={() => setWaterGlasses(Math.min(waterGoal + 4, waterGlasses + 1))} style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: colors.hydration, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 12px ${colors.hydration}30` }}>
                    <Plus size={18} color="#fff" />
                  </button>
                </div>

                {/* Tip */}
                <div style={{ marginTop: 20, background: `${colors.ai}08`, borderRadius: 12, padding: "12px 16px", border: `1px solid ${colors.ai}12`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Sparkles size={14} color={colors.ai} style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: "0.8rem", color: colors.primary, margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: colors.ai }}>AI Tip:</strong> You tend to drink less water after 4 PM. Set a reminder to stay hydrated through the evening.
                  </p>
                </div>
              </div>

              {/* Sleep Tracker */}
              <div style={{ background: colors.surface, borderRadius: 24, padding: "28px", border: `1px solid ${colors.secondary}12` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ padding: 10, background: `${colors.sleep}12`, borderRadius: 12 }}>
                      <Moon size={22} color={colors.sleep} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Sleep Analysis</h3>
                      <span style={{ fontSize: "0.8rem", color: colors.secondary }}>Last night's sleep</span>
                    </div>
                  </div>
                  <div style={{ background: `${colors.tertiary}12`, padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, color: colors.tertiary }}>Good</div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.sleep }}>{sleepData.hours}</div>
                    <div style={{ fontSize: "0.75rem", color: colors.secondary }}>Total Hours</div>
                  </div>
                  <div style={{ width: 1, background: `${colors.secondary}20` }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.sleep }}>{sleepData.quality}%</div>
                    <div style={{ fontSize: "0.75rem", color: colors.secondary }}>Quality Score</div>
                  </div>
                </div>

                {/* Sleep phases bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 24 }}>
                    <div style={{ width: `${(sleepData.deep / sleepData.hours) * 100}%`, background: "#4338CA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600 }}>{sleepData.deep}h</span>
                    </div>
                    <div style={{ width: `${(sleepData.rem / sleepData.hours) * 100}%`, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600 }}>{sleepData.rem}h</span>
                    </div>
                    <div style={{ width: `${(sleepData.light / sleepData.hours) * 100}%`, background: "#A78BFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600 }}>{sleepData.light}h</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center" }}>
                    {[{ label: "Deep", color: "#4338CA" }, { label: "REM", color: "#7C3AED" }, { label: "Light", color: "#A78BFA" }].map(p => (
                      <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
                        <span style={{ fontSize: "0.75rem", color: colors.secondary }}>{p.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  {[{ icon: Sun, label: "Bedtime", val: sleepData.bedtime }, { icon: Clock, label: "Wake Up", val: sleepData.wakeup }].map((s, i) => (
                    <div key={i} style={{ flex: 1, background: colors.neutral, borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <s.icon size={16} color={colors.sleep} />
                      <div>
                        <div style={{ fontSize: "0.7rem", color: colors.secondary }}>{s.label}</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{s.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diet Plan Section */}
            <div style={{ background: colors.surface, borderRadius: 24, padding: "28px", border: `1px solid ${colors.secondary}12` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 10, background: `${colors.nutrition}12`, borderRadius: 12 }}>
                    <Apple size={22} color={colors.nutrition} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Diet Plan</h3>
                    <span style={{ fontSize: "0.8rem", color: colors.secondary }}>AI-personalized nutrition schedule</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Flame size={16} color={colors.nutrition} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{totalCalEaten} / {totalCalGoal} kcal</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {mealPlan.map((meal, i) => {
                  const MealIcon = meal.icon;
                  return (
                    <div key={i} style={{ background: meal.done ? `${colors.tertiary}06` : colors.neutral, borderRadius: 18, padding: "20px", border: `1px solid ${meal.done ? colors.tertiary + "20" : colors.secondary + "12"}`, position: "relative", transition: "all 0.2s ease" }}>
                      {meal.done && <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: colors.tertiary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>✓</span>
                      </div>}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{ padding: 8, background: `${colors.nutrition}10`, borderRadius: 10 }}>
                          <MealIcon size={18} color={colors.nutrition} />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{meal.label}</div>
                          <div style={{ fontSize: "0.7rem", color: colors.secondary }}>{meal.time}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        {meal.items.map((item, j) => (
                          <div key={j} style={{ fontSize: "0.8rem", color: colors.primary, display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: colors.tertiary, flexShrink: 0 }} />
                            {item}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: colors.nutrition }}>{meal.cal} kcal</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise Log */}
            <div style={{ background: colors.surface, borderRadius: 24, padding: "28px", border: `1px solid ${colors.secondary}12` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: 10, background: `${colors.exercise}12`, borderRadius: 12 }}>
                    <Dumbbell size={22} color={colors.exercise} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Exercise Log</h3>
                    <span style={{ fontSize: "0.8rem", color: colors.secondary }}>Today's workout plan</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600, color: colors.tertiary }}>
                  <TrendingUp size={16} /> {totalCalBurned} kcal burned
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {exerciseLog.map((ex, i) => {
                  const ExIcon = ex.icon;
                  return (
                    <div key={i} style={{ background: ex.done ? `${colors.tertiary}06` : colors.neutral, borderRadius: 18, padding: "20px", border: `1px solid ${ex.done ? colors.tertiary + "20" : colors.secondary + "12"}`, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${colors.exercise}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ExIcon size={24} color={colors.exercise} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{ex.name}</div>
                        <div style={{ fontSize: "0.8rem", color: colors.secondary, marginTop: 2 }}>{ex.duration} • {ex.cal} kcal</div>
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: ex.done ? colors.tertiary : `${colors.secondary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {ex.done ? <span style={{ color: "#fff", fontSize: "0.7rem" }}>✓</span> : <ChevronRight size={14} color={colors.secondary} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
