import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8081/api";

const VARIETIES = ["WILLAMETTE", "MEEKER", "TULAMEEN", "HERITAGE", "POLKA"];

const GROWTH_PHASES = [
  { value: "DORMANCY", label: "Dormancy" },
  { value: "BUD_SWELLING", label: "Bud swelling" },
  { value: "LEAFING", label: "Leafing" },
  { value: "PRE_FLOWERING", label: "Pre-flowering" },
  { value: "FLOWERING", label: "Flowering" },
  { value: "FRUITING", label: "Fruiting" },
  { value: "HARVEST", label: "Harvest" },
  { value: "POST_HARVEST", label: "Post-harvest" },
];

const SYMPTOMS = [
  { key: "purple_spot", location: "STEM", label: "Purple spots at bud base", icon: "ti-circle-dot", group: "disease" },
  { key: "cracked_bark", location: "STEM", label: "Cracked bark at stem base (necrosis)", icon: "ti-wave-sine", group: "disease" },
  { key: "necrotic_spot", location: "STEM", label: "Necrotic spots on shoots", icon: "ti-leaf-off", group: "disease" },
  { key: "dried_flower_bud", location: "FLOWER", label: "Dried/severed flower buds", icon: "ti-flower-off", group: "pest" },
  { key: "round_hole_calyx", location: "FLOWER", label: "Round hole at calyx base", icon: "ti-circle-dotted", group: "pest" },
  { key: "whitish_spots", location: "LEAF", label: "Whitish spots on upper leaf", icon: "ti-point", group: "pest" },
  { key: "spider_web", location: "LEAF", label: "Spider web on lower leaf", icon: "ti-spider", group: "pest" },
  { key: "grey_coating", location: "FRUIT", label: "Grey coating / soft watery fruit", icon: "ti-droplet", group: "disease" },
  { key: "galls_on_stem", location: "STEM", label: "Galls (swellings) on stems", icon: "ti-git-commit", group: "pest" },
  { key: "deformed_leaves", location: "LEAF", label: "Deformed leaves and honeydew", icon: "ti-plant-2", group: "pest" },
  { key: "sudden_wilting", location: "ROOT", label: "Sudden wilting (before/during harvest)", icon: "ti-alert-triangle", group: "disease" },
  { key: "purple_spot_stem", location: "STEM", label: "Purple sunken spots on young shoots", icon: "ti-color-swatch", group: "disease" },
];

const WEED_CONDITIONS = [
  { key: "HIGH_WEED_DENSITY", label: "High weed density on the plot" },
  { key: "WEEDS_TALLER_THAN_15CM", label: "Weeds taller than 15 cm" },
  { key: "BROADLEAF_WEEDS_PRESENT", label: "Presence of broadleaf weeds" },
];

const riskColors = {
  HIGH: { bg: "#FCEBEB", text: "#A32D2D", border: "#F09595" },
  URGENT: { bg: "#FAECE7", text: "#993C1D", border: "#F0997B" },
  MEDIUM: { bg: "#FAEEDA", text: "#854F0B", border: "#EF9F27" },
  LOW: { bg: "#EAF3DE", text: "#3B6D11", border: "#97C459" },
};

function Badge({ text, color = "gray" }) {
  const colors = {
    gray: { bg: "#F1EFE8", text: "#5F5E5A" },
    green: { bg: "#EAF3DE", text: "#3B6D11" },
    red: { bg: "#FCEBEB", text: "#A32D2D" },
    amber: { bg: "#FAEEDA", text: "#854F0B" },
    teal: { bg: "#E1F5EE", text: "#0F6E56" },
    purple: { bg: "#EEEDFE", text: "#534AB7" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 500,
      padding: "2px 8px", borderRadius: 4, display: "inline-block"
    }}>{text}</span>
  );
}

function SymptomCard({ symptom, checked, severity, onToggle, onSeverity }) {
  const groupColor = symptom.group === "disease" ? "#EEEDFE" : "#E1F5EE";
  const groupTextColor = symptom.group === "disease" ? "#534AB7" : "#0F6E56";
  return (
    <div onClick={() => onToggle(symptom.key)} style={{
      border: checked ? "1.5px solid #7F77DD" : "0.5px solid var(--color-border-tertiary)",
      borderRadius: 10, padding: "12px 14px", cursor: "pointer",
      background: checked ? "#EEEDFE" : "var(--color-background-primary)",
      transition: "all 0.15s ease", userSelect: "none"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 2,
          border: checked ? "none" : "1.5px solid var(--color-border-secondary)",
          background: checked ? "#7F77DD" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {checked && <i className="ti ti-check" style={{ fontSize: 13, color: "#fff" }} aria-hidden="true" />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.4 }}>
            {symptom.label}
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{
              fontSize: 11, background: groupColor, color: groupTextColor,
              padding: "1px 7px", borderRadius: 3, fontWeight: 500
            }}>
              {symptom.group === "disease" ? "Diseases" : "Pests"}
            </span>
          </div>
        </div>
      </div>
      {checked && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #AFA9EC" }}
          onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#534AB7", fontWeight: 500, minWidth: 120 }}>
              Symptom severity:
            </span>
            <input type="range" min="1" max="10" step="1" value={severity}
              onChange={e => onSeverity(symptom.key, parseInt(e.target.value))}
              style={{ flex: 1 }} />
            <span style={{
              fontSize: 14, fontWeight: 500, color: "#534AB7",
              minWidth: 28, textAlign: "center"
            }}>{severity}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888", marginTop: 2 }}>
            <span>Mild</span><span>Moderate</span><span>Critical</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TreatmentPlanCard({ plan, index }) {
  const [expanded, setExpanded] = useState(true);
  const diag = plan.diagnosis;
  return (
    <div style={{
      border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12,
      overflow: "hidden", background: "var(--color-background-primary)"
    }}>
      <div style={{
        padding: "14px 18px", background: "#EEEDFE", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }} onClick={() => setExpanded(!expanded)}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#26215C" }}>
            <i className="ti ti-microscope" aria-hidden="true" style={{ marginRight: 8 }} />
            {diag?.issueName || `Diagnosis ${index + 1}`}
          </div>
          {diag?.certainty && (
            <div style={{ fontSize: 12, color: "#534AB7", marginTop: 2 }}>
              Certainty: <strong>{Math.round(diag.certainty * 100)}%</strong>
            </div>
          )}
        </div>
        <i className={`ti ti-chevron-${expanded ? "up" : "down"}`} aria-hidden="true"
          style={{ color: "#534AB7", fontSize: 18 }} />
      </div>
      {expanded && (
        <div style={{ padding: "16px 18px" }}>
          {plan.alerts && plan.alerts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Alerts
              </div>
              {plan.alerts.map((alert, i) => (
                <div key={i} style={{
                  background: "#FAEEDA", border: "0.5px solid #EF9F27",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 8,
                  fontSize: 13, color: "#633806", display: "flex", alignItems: "flex-start", gap: 8
                }}>
                  <i className="ti ti-alert-triangle" aria-hidden="true" style={{ color: "#BA7517", flexShrink: 0, marginTop: 1 }} />
                  {alert}
                </div>
              ))}
            </div>
          )}
          {plan.recommendedTreatments && plan.recommendedTreatments.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recommended Treatments
              </div>
              {plan.recommendedTreatments.map((t, i) => (
                <div key={i} style={{
                  background: "var(--color-background-secondary)", borderRadius: 8,
                  padding: "10px 14px", marginBottom: 8, fontSize: 13,
                  color: "var(--color-text-primary)", display: "flex", alignItems: "flex-start", gap: 8
                }}>
                  <i className="ti ti-pill" aria-hidden="true" style={{ color: "#1D9E75", flexShrink: 0, marginTop: 1 }} />
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function alertIcon(level) {
  if (level === "URGENT") return "ti-alert-octagon";
  if (level === "HIGH") return "ti-alert-triangle";
  if (level === "MEDIUM") return "ti-alert-circle";
  return "ti-info-circle";
}

function CepAlertBanner({ alerts, loading, error, onRefresh }) {
  const [collapsed, setCollapsed] = useState(false);

  if (loading && alerts.length === 0) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
        background: "var(--color-background-secondary)", borderRadius: 8,
        fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 20
      }}>
        <i className="ti ti-radar-2" aria-hidden="true" />
        Checking CEP system...
      </div>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", background: "var(--color-background-secondary)",
        borderRadius: 8, fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 20
      }}>
        <span><i className="ti ti-plug-connected-x" aria-hidden="true" style={{ marginRight: 6 }} />
          CEP service unavailable ({error})</span>
        <button onClick={onRefresh} style={{
          border: "none", background: "transparent", color: "#534AB7",
          fontSize: 12, cursor: "pointer", textDecoration: "underline"
        }}>Try again</button>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
        background: "#E1F5EE", borderRadius: 8, fontSize: 12, color: "#0F6E56", marginBottom: 20
      }}>
        <i className="ti ti-shield-check" aria-hidden="true" />
        No active CEP alerts currently — weather conditions are normal.
      </div>
    );
  }

  const hasUrgent = alerts.some(a => a.riskLevel === "URGENT");

  return (
    <div style={{
      border: `1px solid ${hasUrgent ? "#F0997B" : "#EF9F27"}`,
      borderRadius: 10, marginBottom: 20, overflow: "hidden",
      background: hasUrgent ? "#FAECE7" : "#FAEEDA"
    }}>
      <div onClick={() => setCollapsed(!collapsed)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", cursor: "pointer"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className={`ti ${hasUrgent ? "ti-alert-octagon" : "ti-alert-triangle"}`} aria-hidden="true"
            style={{ color: hasUrgent ? "#993C1D" : "#854F0B", fontSize: 18 }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: hasUrgent ? "#993C1D" : "#854F0B" }}>
            CEP system: {alerts.length} active alert{alerts.length === 1 ? "" : "s"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={(e) => { e.stopPropagation(); onRefresh(); }} title="Refresh" style={{
            border: "none", background: "transparent", cursor: "pointer",
            color: hasUrgent ? "#993C1D" : "#854F0B", display: "flex"
          }}>
            <i className="ti ti-refresh" aria-hidden="true" />
          </button>
          <i className={`ti ti-chevron-${collapsed ? "down" : "up"}`} aria-hidden="true"
            style={{ color: hasUrgent ? "#993C1D" : "#854F0B" }} />
        </div>
      </div>
      {!collapsed && (
        <div style={{ padding: "0 14px 12px" }}>
          {alerts.map((alert, i) => {
            const colors = riskColors[alert.riskLevel] || riskColors.MEDIUM;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: "var(--color-background-primary)", borderRadius: 8,
                padding: "10px 12px", marginTop: 8, border: `0.5px solid ${colors.border}`
              }}>
                <i className={`ti ${alertIcon(alert.riskLevel)}`} aria-hidden="true"
                  style={{ color: colors.text, fontSize: 16, flexShrink: 0, marginTop: 1 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {alert.pathogen}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 4,
                      background: colors.bg, color: colors.text
                    }}>{alert.riskLevel}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                    {alert.recommendation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 16 }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #EEEDFE",
        borderTop: "3px solid #7F77DD", borderRadius: "50%",
        animation: "spin 0.9s linear infinite"
      }} />
      <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
        Expert system is analyzing data...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function RaspberryExpertSystem() {
  const [step, setStep] = useState(1);
  const [variety, setVariety] = useState("");
  const [phase, setPhase] = useState("");
  const [plotAge, setPlotAge] = useState(3);
  const [location, setLocation] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [severities, setSeverities] = useState({});
  const [weedConditions, setWeedConditions] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeGroup, setActiveGroup] = useState("all");

  const [cepAlerts, setCepAlerts] = useState([]);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState(null);

  const fetchCepAlerts = useCallback(async () => {
    if (!location.trim()) {
      setCepAlerts([]);
      return;
    }
    setCepLoading(true);
    setCepError(null);
    try {
      const response = await fetch(
        `${API_BASE}/cep/status?location=${encodeURIComponent(location.trim())}&usePseudoClock=true`
      );
      if (!response.ok) throw new Error(`${response.status}`);
      const data = await response.json();
      setCepAlerts(data);
    } catch (err) {
      setCepError(err.message || "error");
    } finally {
      setCepLoading(false);
    }
  }, [location]);

  // Polling: check CEP alerts every 8 seconds as soon as the location is entered
  useEffect(() => {
    if (!location.trim()) {
      setCepAlerts([]);
      return;
    }
    fetchCepAlerts();
    const interval = setInterval(fetchCepAlerts, 8000);
    return () => clearInterval(interval);
  }, [location, fetchCepAlerts]);

  const toggleSymptom = (key) => {
    setSelectedSymptoms(prev => {
      const next = { ...prev };
      if (next[key]) { delete next[key]; }
      else { next[key] = true; }
      return next;
    });
    setSeverities(prev => ({ ...prev, [key]: prev[key] || 5 }));
  };

  const setSeverity = (key, val) => {
    setSeverities(prev => ({ ...prev, [key]: val }));
  };

  const toggleWeed = (key) => {
    setWeedConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const canProceedStep1 = variety && phase && location.trim();
  const checkedSymptoms = Object.keys(selectedSymptoms).filter(k => selectedSymptoms[k]);

  // Ažuriran buildRequest kako bi podržavao tvoj format objekta u Javi
  const buildRequest = () => {
    const symptomsPayload = checkedSymptoms.map(key => {
      const symDef = SYMPTOMS.find(s => s.key === key);
      return {
        name: key,
        location: symDef.location,
        severity: severities[key] || 5
      };
    });
    
    // weed conditions ostaju kao niz
    const weedsPayload = Object.keys(weedConditions).filter(k => weedConditions[k]);
    
    return {
      state: {
        variety,
        currentPhase: phase,
        age: plotAge,
        location: location.trim(),
        symptoms: symptomsPayload
      },
      weedConditions: weedsPayload,
      weatherMeasurements: [] // Omogućava validan CEP JSON prolaz do Rete mreže
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const payload = buildRequest();
      const response = await fetch(`${API_BASE}/diagnosis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResults(data);
      setStep(4);
    } catch (err) {
      setError(err.message || "Error communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1); setVariety(""); setPhase(""); setPlotAge(3); setLocation("");
    setSelectedSymptoms({}); setSeverities({}); setWeedConditions({});
    setResults(null); setError(null);
  };

  const filteredSymptoms = activeGroup === "all" ? SYMPTOMS
    : SYMPTOMS.filter(s => s.group === activeGroup);

  const steps = ["Plot", "Symptoms", "Review", "Results"];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "var(--font-sans)" }}>
      <h2 className="sr-only">Raspberry Expert System</h2>

      {/* Header */}
      <div style={{ marginBottom: 28, borderBottom: "0.5px solid var(--color-border-tertiary)", paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "#EEEDFE",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <i className="ti ti-plant-2" aria-hidden="true" style={{ fontSize: 22, color: "#534AB7" }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>
              Raspberry Plot Diagnostics
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              Expert system for protection recommendations
            </div>
          </div>
        </div>
        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                height: 4, width: "100%", borderRadius: 2,
                background: i + 1 <= step ? "#7F77DD" : "var(--color-border-tertiary)"
              }} />
              <span style={{ fontSize: 11, color: i + 1 <= step ? "#534AB7" : "var(--color-text-secondary)" }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {location.trim() && (
        <CepAlertBanner
          alerts={cepAlerts}
          loading={cepLoading}
          error={cepError}
          onRefresh={fetchCepAlerts}
        />
      )}

      {/* Step 1: Plot Details */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 20, color: "var(--color-text-primary)" }}>
            <i className="ti ti-map-pin" aria-hidden="true" style={{ marginRight: 8, color: "#7F77DD" }} />
            Plot details
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                Plot location
              </label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Cacak, Plot 3"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, border: "0.5px solid var(--color-border-secondary)" }} />
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>
                <i className="ti ti-radar-2" aria-hidden="true" style={{ marginRight: 4 }} />
                Used to connect with live CEP weather alerts for this plot.
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                Raspberry variety
              </label>
              <select value={variety} onChange={e => setVariety(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14 }}>
                <option value="">Select variety...</option>
                {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                Phenological growth phase
              </label>
              <select value={phase} onChange={e => setPhase(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14 }}>
                <option value="">Select phase...</option>
                {GROWTH_PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>
                Plot age: <strong style={{ color: "var(--color-text-primary)" }}>{plotAge} {plotAge === 1 ? "year" : "years"}</strong>
              </label>
              <input type="range" min="1" max="20" step="1" value={plotAge}
                onChange={e => setPlotAge(parseInt(e.target.value))}
                style={{ width: "100%" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
                <span>1 yr.</span><span>10 yrs.</span><span>20 yrs.</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 10 }}>
                Weed conditions
              </label>
              <div style={{ display: "grid", gap: 8 }}>
                {WEED_CONDITIONS.map(w => (
                  <div key={w.key} onClick={() => toggleWeed(w.key)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    border: weedConditions[w.key] ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-tertiary)",
                    borderRadius: 8, cursor: "pointer",
                    background: weedConditions[w.key] ? "#E1F5EE" : "var(--color-background-primary)"
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 3, flexShrink: 0,
                      border: weedConditions[w.key] ? "none" : "1.5px solid var(--color-border-secondary)",
                      background: weedConditions[w.key] ? "#1D9E75" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {weedConditions[w.key] && <i className="ti ti-check" style={{ fontSize: 12, color: "#fff" }} aria-hidden="true" />}
                    </div>
                    <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{w.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!canProceedStep1} style={{
            marginTop: 24, width: "100%", padding: "11px 0", borderRadius: 8,
            background: canProceedStep1 ? "#7F77DD" : "var(--color-background-secondary)",
            color: canProceedStep1 ? "#fff" : "var(--color-text-secondary)",
            border: "none", fontSize: 14, fontWeight: 500, cursor: canProceedStep1 ? "pointer" : "not-allowed"
          }}>
            Continue to symptoms →
          </button>
        </div>
      )}

      {/* Step 2: Symptoms */}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: "var(--color-text-primary)" }}>
            <i className="ti ti-stethoscope" aria-hidden="true" style={{ marginRight: 8, color: "#7F77DD" }} />
            Visual symptoms
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>
            Select all visible symptoms on the plants and estimate severity (1–10).
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["all", "disease", "pest"].map(g => (
              <button key={g} onClick={() => setActiveGroup(g)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                border: "0.5px solid var(--color-border-secondary)",
                background: activeGroup === g ? "#7F77DD" : "transparent",
                color: activeGroup === g ? "#fff" : "var(--color-text-secondary)",
                cursor: "pointer"
              }}>
                {g === "all" ? "All symptoms" : g === "disease" ? "Diseases" : "Pests"}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {filteredSymptoms.map(s => (
              <SymptomCard key={s.key} symptom={s}
                checked={!!selectedSymptoms[s.key]}
                severity={severities[s.key] || 5}
                onToggle={toggleSymptom} onSeverity={setSeverity} />
            ))}
          </div>

          {checkedSymptoms.length > 0 && (
            <div style={{
              marginTop: 16, padding: "10px 14px", background: "#EEEDFE",
              borderRadius: 8, fontSize: 13, color: "#534AB7"
            }}>
              <i className="ti ti-check" aria-hidden="true" style={{ marginRight: 6 }} />
              Selected {checkedSymptoms.length} {checkedSymptoms.length === 1 ? "symptom" : "symptoms"}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{
              flex: 1, padding: "11px 0", borderRadius: 8, background: "transparent",
              border: "0.5px solid var(--color-border-secondary)", fontSize: 14,
              color: "var(--color-text-secondary)", cursor: "pointer"
            }}>← Back</button>
            <button onClick={() => setStep(3)} style={{
              flex: 2, padding: "11px 0", borderRadius: 8, background: "#7F77DD",
              border: "none", fontSize: 14, fontWeight: 500, color: "#fff", cursor: "pointer"
            }}>Review inputs →</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 20, color: "var(--color-text-primary)" }}>
            <i className="ti ti-clipboard-list" aria-hidden="true" style={{ marginRight: 8, color: "#7F77DD" }} />
            Review inputs
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ padding: "14px 16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, fontWeight: 500 }}>PLOT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Variety:</span><br />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{variety}</span></div>
                <div><span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Age:</span><br />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{plotAge} yrs.</span></div>
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Location:</span><br />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{location}</span>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Phase:</span><br />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {GROWTH_PHASES.find(p => p.value === phase)?.label}
                  </span>
                </div>
              </div>
            </div>

            {checkedSymptoms.length > 0 && (
              <div style={{ padding: "14px 16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, fontWeight: 500 }}>
                  SYMPTOMS ({checkedSymptoms.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {checkedSymptoms.map(k => {
                    const s = SYMPTOMS.find(sym => sym.key === k);
                    return (
                      <span key={k} style={{
                        background: "#EEEDFE", color: "#534AB7", fontSize: 12,
                        padding: "3px 10px", borderRadius: 5
                      }}>
                        {s?.label} <strong>({severities[k] || 5})</strong>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {Object.keys(weedConditions).some(k => weedConditions[k]) && (
              <div style={{ padding: "14px 16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, fontWeight: 500 }}>WEED CONDITIONS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.keys(weedConditions).filter(k => weedConditions[k]).map(k => {
                    const w = WEED_CONDITIONS.find(wc => wc.key === k);
                    return (
                      <span key={k} style={{
                        background: "#E1F5EE", color: "#0F6E56", fontSize: 12,
                        padding: "3px 10px", borderRadius: 5
                      }}>{w?.label}</span>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div style={{
                padding: "12px 16px", background: "#FCEBEB", border: "0.5px solid #F09595",
                borderRadius: 8, fontSize: 13, color: "#A32D2D"
              }}>
                <i className="ti ti-circle-x" aria-hidden="true" style={{ marginRight: 8 }} />
                {error}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setStep(2)} style={{
              flex: 1, padding: "11px 0", borderRadius: 8, background: "transparent",
              border: "0.5px solid var(--color-border-secondary)", fontSize: 14,
              color: "var(--color-text-secondary)", cursor: "pointer"
            }}>← Symptoms</button>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: 2, padding: "11px 0", borderRadius: 8,
              background: loading ? "var(--color-background-secondary)" : "#534AB7",
              border: "none", fontSize: 14, fontWeight: 500,
              color: loading ? "var(--color-text-secondary)" : "#fff",
              cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? "Analyzing..." : "Run diagnosis ↗"}
            </button>
          </div>
          {loading && <LoadingSpinner />}
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && results && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" }}>
              <i className="ti ti-report-medical" aria-hidden="true" style={{ marginRight: 8, color: "#7F77DD" }} />
              Diagnosis results
            </div>
            <Badge text={`${results.length} diagnos${results.length === 1 ? "is" : "es"}`} color="purple" />
          </div>

          {results.length === 0 && (
            <div style={{
              padding: "32px 20px", textAlign: "center",
              background: "var(--color-background-secondary)", borderRadius: 12
            }}>
              <i className="ti ti-circle-check" aria-hidden="true" style={{ fontSize: 40, color: "#1D9E75", display: "block", marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>
                No diseases detected
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                Based on the entered symptoms, the system did not identify an active infection.
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 14 }}>
            {results.map((plan, i) => (
              <TreatmentPlanCard key={i} plan={plan} index={i} />
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(3)} style={{
              flex: 1, padding: "11px 0", borderRadius: 8, background: "transparent",
              border: "0.5px solid var(--color-border-secondary)", fontSize: 14,
              color: "var(--color-text-secondary)", cursor: "pointer"
            }}>← Review</button>
            <button onClick={reset} style={{
              flex: 1, padding: "11px 0", borderRadius: 8, background: "#7F77DD",
              border: "none", fontSize: 14, fontWeight: 500, color: "#fff", cursor: "pointer"
            }}>New diagnosis</button>
          </div>
        </div>
      )}
    </div>
  );
}