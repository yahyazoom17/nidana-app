import { useState, useEffect } from "react";
import {
  Leaf, BrainCircuit, Activity,
  Droplets, Apple, Moon, Footprints, Heart, Flame,
  Plus, Minus, UtensilsCrossed, Clock, Sun, Sparkles,
  TrendingUp, ChevronRight, Dumbbell, Wind, Coffee,
  GlassWater, Loader2, AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchLifestyleDashboard,
  updateHydration,
  type LifestyleDashboard,
  type DietMeal,
  type ExerciseLog as ExerciseLogType,
  type SleepLog,
  type HydrationLog,
} from "@/lib/api";
import { mockLifestyleDashboard, MOCK_PATIENT } from "@/lib/mockData";

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

/* ─── Meal icon map ─── */
const mealIconMap: Record<string, typeof Coffee> = {
  Breakfast: Coffee,
  Lunch: UtensilsCrossed,
  Snack: Apple,
  Dinner: UtensilsCrossed,
};

/* ─── Exercise icon map ─── */
const exerciseIconMap: Record<string, typeof Footprints> = {
  "Morning Walk": Footprints,
  "Yoga Session": Wind,
  "Strength Training": Dumbbell,
};

export default function LifestyleTrackerPage() {
  const [dashboard, setDashboard] = useState<LifestyleDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waterGlasses, setWaterGlasses] = useState(0);

  useEffect(() => {
    fetchLifestyleDashboard()
      .then((data) => {
        setDashboard(data);
        setWaterGlasses(data.hydration?.glasses ?? 0);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load lifestyle dashboard, using mock data:", err);
        setDashboard(mockLifestyleDashboard);
        setWaterGlasses(mockLifestyleDashboard.hydration?.glasses ?? 0);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const hydration: HydrationLog | null = dashboard?.hydration ?? null;
  const sleepData: SleepLog | null = dashboard?.sleep ?? null;
  const dietMeals: DietMeal[] = dashboard?.diet_meals ?? [];
  const exercises: ExerciseLogType[] = dashboard?.exercises ?? [];
  const totalCalEaten = dashboard?.diet_calorie_total ?? 0;
  const totalCalGoal = dashboard?.diet_calorie_goal ?? 1800;
  const totalCalBurned = dashboard?.exercise_calorie_total ?? 0;

  const waterGoal = hydration?.goal_glasses ?? 8;
  const waterPercent = Math.min((waterGlasses / waterGoal) * 100, 100);
  const sleepQuality = sleepData?.quality_pct ?? 0;
  const sleepHours = sleepData?.total_hours ?? 0;
  const deepHours = sleepData ? (sleepData.deep_pct ?? 0) / 100 * sleepHours : 0;
  const remHours = sleepData ? (sleepData.rem_pct ?? 0) / 100 * sleepHours : 0;
  const lightHours = sleepData ? (sleepData.light_pct ?? 0) / 100 * sleepHours : 0;

  const handleWaterChange = (delta: number) => {
    const newVal = Math.max(0, Math.min(waterGoal + 4, waterGlasses + delta));
    setWaterGlasses(newVal);
    // Persist to backend
    if (hydration?.id) {
      updateHydration(hydration.id, newVal, waterGoal).catch((err) =>
        console.error("Failed to update hydration:", err)
      );
    }
  };

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
              <p style={{ fontSize: "0.9rem", color: colors.secondary, marginLeft: 20 }}>
                Patient: <strong style={{ color: colors.primary }}>{MOCK_PATIENT.fullName}</strong> — Track hydration, nutrition, exercise & sleep for holistic wellness.
              </p>
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

            {/* Loading State */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12 }}>
                <Loader2 size={24} color={colors.ai} style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: "1rem", color: colors.secondary }}>Loading lifestyle data...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px", background: `${colors.alert}10`, borderRadius: 16, border: `1px solid ${colors.alert}30` }}>
                <AlertTriangle size={20} color={colors.alert} />
                <span style={{ fontSize: "0.9rem", color: colors.primary }}>{error}</span>
              </div>
            )}

            {!loading && !error && dashboard && (<>
            {/* Summary Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "Hydration", value: `${waterGlasses}/${waterGoal}`, unit: "glasses", icon: GlassWater, color: colors.hydration, pct: waterPercent },
                { label: "Calories In", value: `${totalCalEaten}`, unit: `/ ${totalCalGoal} kcal`, icon: Flame, color: colors.nutrition, pct: (totalCalEaten / totalCalGoal) * 100 },
                { label: "Calories Burned", value: `${totalCalBurned}`, unit: "kcal", icon: Dumbbell, color: colors.exercise, pct: (totalCalBurned / 650) * 100 },
                { label: "Sleep Score", value: `${sleepQuality}`, unit: "/ 100", icon: Moon, color: colors.sleep, pct: sleepQuality },
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
                  <button onClick={() => handleWaterChange(-1)} style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${colors.secondary}25`, background: colors.neutral, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Minus size={18} color={colors.secondary} />
                  </button>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Array.from({ length: waterGoal }).map((_, i) => (
                      <div key={i} style={{ width: 12, height: 28, borderRadius: 4, background: i < waterGlasses ? colors.hydration : `${colors.hydration}15`, transition: "background 0.3s ease" }} />
                    ))}
                  </div>
                  <button onClick={() => handleWaterChange(1)} style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: colors.hydration, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 12px ${colors.hydration}30` }}>
                    <Plus size={18} color="#fff" />
                  </button>
                </div>

                {/* Tip */}
                {hydration?.ai_tip && (
                <div style={{ marginTop: 20, background: `${colors.ai}08`, borderRadius: 12, padding: "12px 16px", border: `1px solid ${colors.ai}12`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Sparkles size={14} color={colors.ai} style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: "0.8rem", color: colors.primary, margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: colors.ai }}>AI Tip:</strong> {hydration.ai_tip}
                  </p>
                </div>
                )}
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
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.sleep }}>{sleepHours}</div>
                    <div style={{ fontSize: "0.75rem", color: colors.secondary }}>Total Hours</div>
                  </div>
                  <div style={{ width: 1, background: `${colors.secondary}20` }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.sleep }}>{sleepQuality}%</div>
                    <div style={{ fontSize: "0.75rem", color: colors.secondary }}>Quality Score</div>
                  </div>
                </div>

                {/* Sleep phases bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 24 }}>
                    <div style={{ width: `${sleepHours > 0 ? (deepHours / sleepHours) * 100 : 0}%`, background: "#4338CA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600 }}>{deepHours.toFixed(1)}h</span>
                    </div>
                    <div style={{ width: `${sleepHours > 0 ? (remHours / sleepHours) * 100 : 0}%`, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600 }}>{remHours.toFixed(1)}h</span>
                    </div>
                    <div style={{ width: `${sleepHours > 0 ? (lightHours / sleepHours) * 100 : 0}%`, background: "#A78BFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 600 }}>{lightHours.toFixed(1)}h</span>
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
                  {[{ icon: Sun, label: "Bedtime", val: sleepData?.bedtime ?? "--" }, { icon: Clock, label: "Wake Up", val: sleepData?.wake_time ?? "--" }].map((s, i) => (
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
                {dietMeals.map((meal, i) => {
                  const MealIcon = mealIconMap[meal.meal_type] ?? UtensilsCrossed;
                  const items = meal.items ?? [];
                  return (
                    <div key={meal.id ?? i} style={{ background: meal.is_completed ? `${colors.tertiary}06` : colors.neutral, borderRadius: 18, padding: "20px", border: `1px solid ${meal.is_completed ? colors.tertiary + "20" : colors.secondary + "12"}`, position: "relative", transition: "all 0.2s ease" }}>
                      {meal.is_completed && <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: colors.tertiary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>✓</span>
                      </div>}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{ padding: 8, background: `${colors.nutrition}10`, borderRadius: 10 }}>
                          <MealIcon size={18} color={colors.nutrition} />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{meal.meal_type}</div>
                          <div style={{ fontSize: "0.7rem", color: colors.secondary }}>{meal.scheduled_time ?? ""}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        {items.map((item, j) => (
                          <div key={j} style={{ fontSize: "0.8rem", color: colors.primary, display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: colors.tertiary, flexShrink: 0 }} />
                            {item.name}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: colors.nutrition }}>{meal.total_calories} kcal</div>
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
                {exercises.map((ex, i) => {
                  const ExIcon = exerciseIconMap[ex.exercise_name] ?? Dumbbell;
                  return (
                    <div key={ex.id ?? i} style={{ background: ex.is_completed ? `${colors.tertiary}06` : colors.neutral, borderRadius: 18, padding: "20px", border: `1px solid ${ex.is_completed ? colors.tertiary + "20" : colors.secondary + "12"}`, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${colors.exercise}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ExIcon size={24} color={colors.exercise} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{ex.exercise_name}</div>
                        <div style={{ fontSize: "0.8rem", color: colors.secondary, marginTop: 2 }}>{ex.duration_min} min • {ex.calories_burned} kcal</div>
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: ex.is_completed ? colors.tertiary : `${colors.secondary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {ex.is_completed ? <span style={{ color: "#fff", fontSize: "0.7rem" }}>✓</span> : <ChevronRight size={14} color={colors.secondary} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            </>)}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
