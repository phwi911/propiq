import { useState, useEffect } from "react";

const fmt = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);

const pct = (n) => n.toFixed(1) + "%";

// Must Société inspired palette
// Warm cream background, taupe borders, charcoal text, bronze accent
const C = {
  bg:         "#f7f4f0",
  surface:    "#ffffff",
  surfaceAlt: "#f2ede7",
  border:     "#e2d9ce",
  borderHov:  "#c8b9a8",
  text:       "#1c1815",
  textSub:    "#8a7f72",
  textMuted:  "#b5a898",
  accent:     "#9e7c4a",
  accentLt:   "#f0e8dc",
  accentDark: "#7a5e36",
  good:       "#4a7059",
  goodLt:     "#edf3ef",
  bad:        "#904a38",
  badLt:      "#f5ecea",
  divider:    "#ede6dd",
};

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  input[type=range] { -webkit-appearance: none; appearance: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${C.accent}; cursor: pointer; margin-top: -6px; }
  input[type=range]::-webkit-slider-runnable-track { height: 3px; background: transparent; }
`;

function Slider({ label, value, min, max, step, onChange, display }) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
        <span style={{ fontSize: "10px", color: C.textSub, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Jost, sans-serif", fontWeight: "500" }}>
          {label}
        </span>
        <span style={{ fontSize: "15px", color: C.accent, fontFamily: "Cormorant Garamond, serif", fontWeight: "600" }}>
          {display}
        </span>
      </div>
      <div style={{ position: "relative", height: "3px", background: C.border, borderRadius: "2px" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: fill + "%", background: C.accent,
          borderRadius: "2px", transition: "width 0.1s",
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute", top: "-10px", left: 0,
            width: "100%", height: "22px", opacity: 0, cursor: "pointer",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, accent, positive }) {
  const isGood = positive === true;
  const isBad = positive === false;
  const bg = accent ? C.accentLt : isGood ? C.goodLt : isBad ? C.badLt : C.surface;
  const border = accent ? C.borderHov : C.border;
  const valColor = accent ? C.accent : isGood ? C.good : isBad ? C.bad : C.text;
  return (
    <div style={{ background: bg, border: "1px solid " + border, borderRadius: "4px", padding: "18px 16px", flex: 1 }}>
      <div style={{ fontSize: "9px", color: C.textSub, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Jost, sans-serif", fontWeight: "500", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontSize: "22px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: valColor, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "5px", fontFamily: "Jost, sans-serif" }}>{sub}</div>
      )}
    </div>
  );
}

function Gauge({ score }) {
  const angle = -135 + (score / 100) * 270;
  const color = score >= 70 ? C.good : score >= 40 ? C.accent : C.bad;
  const label = score >= 70 ? "Strong Buy" : score >= 40 ? "Consider" : "Avoid";
  const dash = (score / 100) * 172;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 4px" }}>
      <div style={{ width: "130px", height: "74px", overflow: "hidden" }}>
        <svg viewBox="0 0 140 80" style={{ width: "100%", height: "auto" }}>
          <path d="M 15 75 A 55 55 0 0 1 125 75" fill="none" stroke={C.border} strokeWidth="8" strokeLinecap="round" />
          <path
            d="M 15 75 A 55 55 0 0 1 125 75"
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={dash + " 172"}
            style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.3s" }}
          />
          <line
            x1="70" y1="75" x2="70" y2="30"
            transform={"rotate(" + angle + ", 70, 75)"}
            stroke={C.text} strokeWidth="1.5" strokeLinecap="round"
            style={{ transition: "transform 0.5s ease" }}
          />
          <circle cx="70" cy="75" r="4" fill={C.text} />
        </svg>
      </div>
      <div style={{ fontSize: "32px", fontFamily: "Cormorant Garamond, serif", fontWeight: "300", color, lineHeight: 1, marginTop: "-6px", letterSpacing: "-0.02em" }}>
        {score}
      </div>
      <div style={{ fontSize: "9px", letterSpacing: "0.18em", color, textTransform: "uppercase", marginTop: "5px", fontFamily: "Jost, sans-serif", fontWeight: "500" }}>
        {label}
      </div>
    </div>
  );
}

export default function ROICalculator() {
  const [price, setPrice] = useState(650000);
  const [rent, setRent] = useState(2800);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(5.5);
  const [expenses, setExpenses] = useState(400);
  const [appreciation, setAppreciation] = useState(3);
  const [tab, setTab] = useState("calculator");
  const [ready, setReady] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

  const down = price * (downPct / 100);
  const loan = price - down;
  const mo = rate / 100 / 12;
  const n = 25 * 12;
  const mortgage = loan * (mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);
  const cashFlow = rent - mortgage - expenses;
  const annualCashFlow = cashFlow * 12;
  const grossYield = (rent * 12 / price) * 100;
  const capRate = ((rent - expenses) * 12 / price) * 100;
  const annualAppreciation = price * (appreciation / 100);
  const roi = ((annualCashFlow + annualAppreciation) / down) * 100;

  const score = Math.min(100, Math.max(0, Math.round(
    (grossYield > 6 ? 30 : grossYield > 4 ? 20 : 10) +
    (cashFlow > 500 ? 30 : cashFlow > 0 ? 20 : cashFlow > -300 ? 5 : 0) +
    (roi > 15 ? 25 : roi > 8 ? 18 : roi > 0 ? 10 : 0) +
    (capRate > 5 ? 15 : capRate > 3 ? 10 : 5)
  )));

  // Risk calculations
  const ltv = ((loan / price) * 100);
  const dscr = (rent * 12) / (mortgage * 12);
  const breakEvenOccupancy = (mortgage + expenses) / rent * 100;
  const stressRate = rate + 2;
  const stressMo = stressRate / 100 / 12;
  const stressMortgage = loan * (stressMo * Math.pow(1 + stressMo, n)) / (Math.pow(1 + stressMo, n) - 1);
  const stressCashFlow = rent - stressMortgage - expenses;
  const vacancyImpact = rent * 0.08 * 12;

  const risks = [
    {
      label: "Leverage (LTV)",
      value: ltv.toFixed(0) + "%",
      score: ltv > 80 ? "High" : ltv > 65 ? "Moderate" : "Low",
      note: ltv > 80 ? "High exposure - small price drops erode equity fast" : ltv > 65 ? "Moderate leverage, manageable if rates rise" : "Conservative leverage with good equity buffer",
    },
    {
      label: "Debt Coverage (DSCR)",
      value: dscr.toFixed(2) + "x",
      score: dscr < 1.1 ? "High" : dscr < 1.3 ? "Moderate" : "Low",
      note: dscr < 1.1 ? "Rent barely covers debt - one vacancy could cause distress" : dscr < 1.3 ? "Adequate coverage but limited cushion" : "Strong coverage ratio - resilient to vacancy",
    },
    {
      label: "Break-even Occupancy",
      value: Math.min(breakEvenOccupancy, 100).toFixed(0) + "%",
      score: breakEvenOccupancy > 90 ? "High" : breakEvenOccupancy > 75 ? "Moderate" : "Low",
      note: breakEvenOccupancy > 90 ? "Need near-full occupancy to stay cash-flow positive" : breakEvenOccupancy > 75 ? "Tolerates some vacancy but limited runway" : "Can sustain significant vacancy and remain profitable",
    },
    {
      label: "Rate Stress Test (+2%)",
      value: fmt(stressCashFlow) + "/mo",
      score: stressCashFlow < -500 ? "High" : stressCashFlow < 0 ? "Moderate" : "Low",
      note: stressCashFlow < -500 ? "Deeply negative if rates rise 2% - refinancing risk is real" : stressCashFlow < 0 ? "Negative cash flow under rate stress - monitor closely" : "Remains positive even in a rate shock scenario",
    },
    {
      label: "Vacancy Cost Exposure",
      value: fmt(vacancyImpact) + "/yr",
      score: vacancyImpact > annualCashFlow * 0.5 ? "High" : vacancyImpact > annualCashFlow * 0.25 ? "Moderate" : "Low",
      note: "One month vacancy per year costs " + fmt(vacancyImpact) + ". Maintain a reserve fund to cover this.",
    },
  ];

  const riskCounts = risks.reduce((a, r) => { a[r.score] = (a[r.score] || 0) + 1; return a; }, {});
  const overallRisk = riskCounts["High"] >= 3 ? "High" : (riskCounts["High"] >= 1 || riskCounts["Moderate"] >= 3) ? "Moderate" : "Low";

  // forecast: [2026, 2027, 2028, 2029, 2030] annual growth %. avg5yr = mean used in calculator.
  const lisbonData = [
    { name: "Beato",            growth: 32.3,  price: 4800, yieldPct: 6.2, tag: "Hottest",
      forecast: [18.0, 13.5, 10.0, 8.5, 7.5], avg5yr: 11.5,
      outlook: "Rapid cooling expected as prices normalise. Still strong mid-term but early buyers already won." },
    { name: "Campo de Ourique", growth: 14.8,  price: 6700, yieldPct: 4.8, tag: "Rising",
      forecast: [12.0, 10.5, 9.0, 8.0, 7.0], avg5yr: 9.3,
      outlook: "Sustained family-driven demand. Residential desirability keeps steady appreciation above city average." },
    { name: "Parque das Nacoes",growth: 12.1,  price: 5840, yieldPct: 5.1, tag: "Rising",
      forecast: [10.0, 8.5, 7.5, 7.0, 6.5], avg5yr: 7.9,
      outlook: "Tech corridor presence anchors demand. Maturing but still outperforms Lisbon average." },
    { name: "Alcantara",        growth: 10.3,  price: 5100, yieldPct: 5.5, tag: "Rising",
      forecast: [9.5, 9.0, 8.0, 7.5, 7.0], avg5yr: 8.2,
      outlook: "Waterfront regeneration continues. Creative economy and proximity to Belem sustain momentum." },
    { name: "Estrela",          growth: 8.4,   price: 5490, yieldPct: 4.6, tag: "Stable",
      forecast: [7.5, 7.0, 6.5, 6.0, 6.0], avg5yr: 6.6,
      outlook: "Consistent blue-chip neighbourhood. Safe store of value but limited upside compared to rising areas." },
    { name: "Santo Antonio",    growth: 7.2,   price: 7290, yieldPct: 3.9, tag: "Mature",
      forecast: [6.0, 5.5, 5.0, 5.0, 4.5], avg5yr: 5.2,
      outlook: "Most expensive parish. Price ceiling limits upside. Yield compression ongoing." },
    { name: "Misericordia",     growth: 4.3,   price: 6790, yieldPct: 4.1, tag: "Mature",
      forecast: [4.5, 4.5, 4.0, 4.0, 3.5], avg5yr: 4.1,
      outlook: "Stable heritage district. Low volatility, low growth. Better suited to wealth preservation." },
    { name: "Avenidas Novas",   growth: 1.7,   price: 6920, yieldPct: 3.8, tag: "Mature",
      forecast: [3.5, 4.0, 4.0, 3.5, 3.0], avg5yr: 3.6,
      outlook: "Recovery expected after underperformance in 2025. Business district demand provides floor." },
    { name: "Chiado",           growth: 1.2,   price: 8200, yieldPct: 3.5, tag: "Mature",
      forecast: [3.0, 3.5, 3.5, 3.0, 3.0], avg5yr: 3.2,
      outlook: "Iconic but fully priced. Tourism-driven demand caps yield. Hold, do not enter at current levels." },
    { name: "Marvila",          growth: -16.9, price: 3600, yieldPct: 7.2, tag: "Cooling",
      forecast: [-5.0, 2.0, 5.5, 7.0, 8.0], avg5yr: 3.5,
      outlook: "Post-hype correction ongoing in 2026. Recovery expected by 2027-28 as affordability attracts new buyers. High yield compensates patient investors." },
  ];

  // Merged + sorted combined market data (lisbonData + emerging areas), sorted by avg5yr desc
  const allAreas = [
    ...lisbonData,
    { name: "Almada",    growth: 18.2, price: 2800, yieldPct: 7.1, tag: "Emerging",
      forecast: [20.0, 16.0, 13.0, 11.0, 9.0], avg5yr: 13.8,
      outlook: "Metro expansion and Costa da Caparica beach access driving demand. Central Lisbon spillover as prices hit EUR 6k/m2.",
      catalyst: "Metro expansion + Costa da Caparica beach access. Central Lisbon spillover as prices hit EUR 6k/m2. Riverfront regeneration underway.",
      signal: ["Metro line extension confirmed", "Young professional inflow", "Lisbon ferry commuters relocating"],
      risk: "Low", phase: "Early Entry", score: 92 },
    { name: "Barreiro",  growth: 15.1, price: 2200, yieldPct: 7.6, tag: "Emerging",
      forecast: [16.0, 13.5, 11.0, 9.5, 8.0], avg5yr: 11.6,
      outlook: "Setubal Peninsula led national growth at +22.6% in 2025. Barreiro benefits from same dynamics with lower entry prices.",
      catalyst: "Setubal Peninsula led national growth at +22.6% in 2025. Lower entry prices than Almada. Waterfront regeneration.",
      signal: ["22.6% peninsula-wide growth in 2025", "Ferry link to Lisbon", "Regeneration of industrial waterfront"],
      risk: "Low", phase: "Rising", score: 84 },
    { name: "Moita",     growth: 12.4, price: 1900, yieldPct: 8.2, tag: "Emerging",
      forecast: [14.0, 12.0, 10.5, 9.0, 8.0], avg5yr: 10.7,
      outlook: "Last truly affordable riverside municipality. Follows exact trajectory Barreiro followed 3 years prior.",
      catalyst: "Last truly affordable riverside municipality. Developer interest confirmed. Follows Barreiro trajectory.",
      signal: ["New residential development pipeline", "Institutional investor activity", "Infrastructure upgrades in progress"],
      risk: "Moderate", phase: "Pre-Emergence", score: 87 },
    { name: "Arroios",   growth: 11.3, price: 4500, yieldPct: 5.8, tag: "Rising",
      forecast: [11.0, 10.0, 9.0, 8.5, 8.0], avg5yr: 9.3,
      outlook: "Inside city limits with affordable prices. Young international community forming. Mirrors Intendente trajectory from 2019-2022.",
      catalyst: "Inside Lisbon city limits with still-affordable prices. Young international community forming.",
      signal: ["New co-working hubs opening", "Cafe and restaurant scene emerging", "Artist and expat community growing"],
      risk: "Low", phase: "Early Rising", score: 79 },
    { name: "Olivais",   growth: 8.7,  price: 3200, yieldPct: 6.4, tag: "Rising",
      forecast: [10.0, 9.0, 8.0, 7.5, 7.0], avg5yr: 8.3,
      outlook: "Adjacent to Beato and Parque das Nacoes. Benefits from Beato tech hub spillover. Underpriced relative to neighbours.",
      catalyst: "Adjacent to Beato and Parque das Nacoes. Benefits from Beato tech hub spillover.",
      signal: ["Proximity to Beato tech corridor", "Metro Red Line access", "Price gap vs Parque das Nacoes narrowing"],
      risk: "Moderate", phase: "Pre-Emergence", score: 76 },
    { name: "Alcochete", growth: 9.3,  price: 2100, yieldPct: 7.8, tag: "Watch",
      forecast: [9.0, 8.5, 8.0, 7.5, 7.0], avg5yr: 8.0,
      outlook: "New international school attracting expat families. Montijo airport proximity creating demand. Still early stage.",
      catalyst: "New international school attracting expat families. Road improvements and Montijo airport proximity.",
      signal: ["New international school opened", "Montijo airport proximity", "Improved road connections A2/A12"],
      risk: "Moderate", phase: "Watch List", score: 71 },
  ].sort((a, b) => b.avg5yr - a.avg5yr);

  const rows = [
    { label: "Rental Income", value: rent, positive: true },
    { label: "Mortgage Payment", value: -mortgage, positive: false },
    { label: "Operating Expenses", value: -expenses, positive: false },
    { label: "Net Cash Flow", value: cashFlow, bold: true, positive: cashFlow >= 0 },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "Jost, sans-serif",
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px",
    }}>
      <style>{fontStyle}</style>
      <div style={{
        width: "100%", maxWidth: "400px",
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", borderBottom: "1px solid " + C.divider, paddingBottom: "24px" }}>
          <div style={{ fontSize: "10px", color: C.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px", fontWeight: "400" }}>
            PropIQ
          </div>
          <h1 style={{ fontSize: "32px", fontFamily: "Cormorant Garamond, serif", fontWeight: "300", color: C.text, margin: "0 0 6px", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Investment Analyzer
          </h1>
          <p style={{ fontSize: "12px", color: C.textSub, margin: 0, fontWeight: "300", letterSpacing: "0.03em" }}>
            Evaluate return on real estate
          </p>
        </div>

        {/* Row 1: Market Research Tab */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "16px" }}>
          <button
            onClick={() => setTab("markets")}
            style={{
              flex: 1, padding: "10px 0",
              border: "none", background: "transparent",
              cursor: "pointer", fontSize: "10px",
              fontWeight: tab === "markets" ? "500" : "400",
              textTransform: "uppercase", letterSpacing: "0.12em",
              fontFamily: "Jost, sans-serif",
              color: tab === "markets" ? C.accent : C.textSub,
              borderBottom: tab === "markets" ? "2px solid " + C.accent : "2px solid transparent",
              marginBottom: "-1px",
              transition: "all 0.2s",
            }}
          >
            Markets
          </button>
        </div>

        {/* Row 2: Deal Analysis Tabs — always visible */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "20px" }}>
          {["calculator", "breakdown", "projection", "risk"].map((t) => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "10px 0",
                border: "none", background: "transparent",
                cursor: "pointer", fontSize: "10px",
                fontWeight: tab === t ? "500" : "400",
                textTransform: "uppercase", letterSpacing: "0.12em",
                fontFamily: "Jost, sans-serif",
                color: tab === t ? C.accent : C.textSub,
                borderBottom: tab === t ? "2px solid " + C.accent : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Score Gauge — only shown for deal analysis tabs */}
        {tab !== "markets" && (
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px", marginBottom: "12px" }}>
            <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", textAlign: "center", marginBottom: "2px", fontWeight: "500" }}>
              Investment Score
            </div>
            <Gauge score={score} />
          </div>
        )}

        {/* Calculator Tab */}
        {tab === "calculator" && (
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "24px 22px", marginBottom: "16px" }}>
            <Slider label="Purchase Price" value={price} min={200000} max={5000000} step={10000} onChange={setPrice} display={fmt(price)} />
            <Slider label="Monthly Rent" value={rent} min={500} max={15000} step={50} onChange={setRent} display={"$" + rent.toLocaleString() + "/mo"} />
            <Slider label="Down Payment" value={downPct} min={5} max={40} step={1} onChange={setDownPct} display={downPct + "% (" + fmt(down) + ")"} />
            <Slider label="Mortgage Rate" value={rate} min={2} max={10} step={0.1} onChange={setRate} display={rate.toFixed(1) + "%"} />
            <Slider label="Monthly Expenses" value={expenses} min={0} max={2000} step={50} onChange={setExpenses} display={"$" + expenses + "/mo"} />
            <div style={{ position: "relative" }}>
              <Slider
                label="Annual Appreciation"
                value={appreciation} min={-20} max={35} step={0.1}
                onChange={(v) => { setAppreciation(v); setSelectedArea(null); }}
                display={appreciation + "%/yr"}
              />
              {selectedArea && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: "-12px", marginBottom: "16px",
                  padding: "6px 10px", borderRadius: "3px",
                  background: C.accentLt, border: "1px solid " + C.borderHov,
                }}>
                  <span style={{ fontSize: "9px", color: C.accent, fontWeight: "500", letterSpacing: "0.08em" }}>
                    {"Using " + selectedArea.name + " 5yr avg forecast (+" + selectedArea.avg5yr + "%/yr avg)"}
                  </span>
                  <button
                    onClick={() => { setSelectedArea(null); setAppreciation(3); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "10px", color: C.textSub, padding: "0 0 0 8px" }}
                  >
                    x
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Breakdown Tab */}
        {tab === "breakdown" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <MetricCard label="Monthly Cash Flow" value={fmt(cashFlow)} sub="after all expenses" accent={cashFlow > 0} positive={cashFlow > 0 ? true : cashFlow < 0 ? false : undefined} />
              <MetricCard label="Annual ROI" value={pct(roi)} sub={"on " + fmt(down) + " down"} accent={roi > 8} positive={roi > 0 ? true : undefined} />
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <MetricCard label="Gross Yield" value={pct(grossYield)} sub="annual rent / price" />
              <MetricCard label="Cap Rate" value={pct(capRate)} sub="net income / price" />
            </div>
            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px" }}>
              <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "16px", fontWeight: "500" }}>
                Monthly Breakdown
              </div>
              {rows.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 0",
                    borderBottom: row.bold ? "none" : "1px solid " + C.divider,
                    marginTop: row.bold ? "4px" : "0",
                  }}
                >
                  <span style={{ fontSize: "12px", color: row.bold ? C.text : C.textSub, fontWeight: row.bold ? "500" : "300", letterSpacing: "0.02em" }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontSize: row.bold ? "16px" : "13px",
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: row.bold ? "500" : "400",
                    color: row.bold ? (cashFlow >= 0 ? C.good : C.bad) : row.positive ? C.good : C.bad,
                  }}>
                    {fmt(Math.abs(row.value))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projection Tab */}
        {tab === "projection" && (
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "24px 22px", marginBottom: "16px" }}>
            <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "20px", fontWeight: "500" }}>
              Property Projection
            </div>
            {[1, 2, 3, 5].map((yr, i) => {
              const futureVal = price * Math.pow(1 + appreciation / 100, yr);
              const totalCash = annualCashFlow * yr;
              const totalProfit = totalCash + (futureVal - price);
              const positive = totalProfit > 0;
              return (
                <div
                  key={yr}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 0",
                    borderBottom: i < 3 ? "1px solid " + C.divider : "none",
                  }}
                >
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                    background: C.accentLt,
                    border: "1px solid " + C.borderHov,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "500", color: C.accent,
                    fontFamily: "Jost, sans-serif",
                  }}>
                    {"Y" + yr}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", color: C.text, fontWeight: "500", marginBottom: "2px" }}>
                      {fmt(futureVal)}
                    </div>
                    <div style={{ fontSize: "10px", color: C.textMuted, fontWeight: "300" }}>
                      {"Cash: " + fmt(totalCash) + "  /  Gain: " + fmt(totalProfit)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "14px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500",
                    color: positive ? C.good : C.bad,
                  }}>
                    {positive ? "+" : ""}{fmt(totalProfit)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Markets Tab */}
        {tab === "markets" && (() => {
          // Chart constants — defined once, used in both chart and list
          const xMin = 2, xMax = 15, yMin = 3, yMax = 9;
          const pL = 36, pR = 308, pT = 12, pB = 162;
          const pW = pR - pL, pH = pB - pT;
          const cx = v => pL + (v - xMin) / (xMax - xMin) * pW;
          const cy = v => pB - (v - yMin) / (yMax - yMin) * pH;
          const xMidVal = 8, yMidVal = 6;
          const dotColor = n => n.avg5yr >= 10 ? "#4a7059" : n.avg5yr >= 7 ? "#9e7c4a" : n.avg5yr >= 5 ? "#7a8a9a" : "#904a38";

          // Label offsets [dx, dy] tuned per area to avoid collisions
          const labelOffsets = {
            "Almada":            [6, -8],
            "Barreiro":          [6, 8],
            "Moita":             [-4, -9],
            "Beato":             [6, -8],
            "Campo de Ourique":  [-6, 9],
            "Arroios":           [6, 5],
            "Alcantara":         [-6, 9],
            "Olivais":           [6, -8],
            "Alcochete":         [-6, -9],
            "Parque das Nacoes": [6, 8],
            "Estrela":           [-6, -9],
            "Santo Antonio":     [-4, 9],
            "Marvila":           [-6, -9],
            "Misericordia":      [6, 8],
            "Avenidas Novas":    [-6, 9],
            "Chiado":            [6, -8],
          };

          return (
          <div style={{ marginBottom: "16px" }}>

            {/* Opportunity Matrix Chart */}
            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "16px 18px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                <div>
                  <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "3px" }}>
                    Opportunity Matrix
                  </div>
                  <div style={{ fontSize: "10px", color: C.textSub, fontWeight: "300" }}>Gross yield vs. 5yr growth forecast</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-end" }}>
                  {[["#4a7059","High growth"], ["#9e7c4a","Mid growth"], ["#7a8a9a","Low growth"], ["#904a38","Slow"]].map(([col, lbl]) => (
                    <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: col }} />
                      <span style={{ fontSize: "8px", color: C.textMuted, fontWeight: "300" }}>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <svg viewBox="0 0 320 178" style={{ width: "100%", fontFamily: "Jost, sans-serif", overflow: "visible" }}>
                {/* Quadrant fills */}
                <rect x={cx(xMidVal)} y={pT} width={pR - cx(xMidVal)} height={cy(yMidVal) - pT} fill="#f0f4f0" opacity="0.7" />
                <rect x={pL} y={cy(yMidVal)} width={cx(xMidVal) - pL} height={pB - cy(yMidVal)} fill="#f7f4f0" opacity="0.7" />
                <rect x={cx(xMidVal)} y={cy(yMidVal)} width={pR - cx(xMidVal)} height={pB - cy(yMidVal)} fill="#fdf6ee" opacity="0.7" />
                <rect x={pL} y={pT} width={cx(xMidVal) - pL} height={cy(yMidVal) - pT} fill="#f5f2f0" opacity="0.4" />

                {/* Quadrant dividers */}
                <line x1={cx(xMidVal)} y1={pT} x2={cx(xMidVal)} y2={pB} stroke="#d8cfc6" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={pL} y1={cy(yMidVal)} x2={pR} y2={cy(yMidVal)} stroke="#d8cfc6" strokeWidth="1" strokeDasharray="3 3" />

                {/* Axes */}
                <line x1={pL} y1={pB} x2={pR} y2={pB} stroke="#c8bfb6" strokeWidth="1" />
                <line x1={pL} y1={pT} x2={pL} y2={pB} stroke="#c8bfb6" strokeWidth="1" />

                {/* X axis ticks */}
                {[4, 6, 8, 10, 12, 14].map(v => (
                  <g key={v}>
                    <line x1={cx(v)} y1={pB} x2={cx(v)} y2={pB + 3} stroke="#b8b0a8" strokeWidth="0.8" />
                    <text x={cx(v)} y={pB + 9} textAnchor="middle" fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif">{v + "%"}</text>
                  </g>
                ))}

                {/* Y axis ticks */}
                {[4, 5, 6, 7, 8].map(v => (
                  <g key={v}>
                    <line x1={pL - 3} y1={cy(v)} x2={pL} y2={cy(v)} stroke="#b8b0a8" strokeWidth="0.8" />
                    <text x={pL - 5} y={cy(v) + 2.5} textAnchor="end" fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif">{v + "%"}</text>
                  </g>
                ))}

                {/* Axis labels */}
                <text x={(pL + pR) / 2} y={pB + 19} textAnchor="middle" fontSize="7.5" fill="#9e7c4a" fontFamily="Jost, sans-serif" letterSpacing="0.1em" fontWeight="500">5-YEAR GROWTH FORECAST</text>
                <text transform={"rotate(-90," + (pL - 22) + "," + ((pT + pB) / 2) + ")"} x={pL - 22} y={(pT + pB) / 2 + 2.5} textAnchor="middle" fontSize="7.5" fill="#9e7c4a" fontFamily="Jost, sans-serif" letterSpacing="0.1em" fontWeight="500">GROSS YIELD</text>

                {/* Quadrant labels */}
                <text x={cx(xMidVal) + 6} y={pT + 8} fontSize="7" fill="#4a7059" fontFamily="Jost, sans-serif" fontWeight="500" letterSpacing="0.08em">SWEET SPOT</text>
                <text x={pL + 4} y={pT + 8} fontSize="7" fill="#7a8a9a" fontFamily="Jost, sans-serif" fontWeight="400" letterSpacing="0.08em">INCOME</text>
                <text x={cx(xMidVal) + 6} y={pB - 4} fontSize="7" fill="#9e7c4a" fontFamily="Jost, sans-serif" fontWeight="400" letterSpacing="0.08em">GROWTH</text>
                <text x={pL + 4} y={pB - 4} fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif" fontWeight="400" letterSpacing="0.08em">MATURE</text>

                {/* Dots + labels */}
                {allAreas.map(n => {
                  const x = cx(n.avg5yr), y = cy(n.yieldPct);
                  const col = dotColor(n);
                  const isSelected = selectedArea && selectedArea.name === n.name;
                  const r = isSelected ? 6.5 : 5;
                  const off = labelOffsets[n.name] || [6, -8];
                  const shortName = n.name.length > 9 ? n.name.split(" ")[0] : n.name;
                  return (
                    <g key={n.name} onClick={() => { setSelectedArea(n); setAppreciation(parseFloat(n.avg5yr.toFixed(1))); }} style={{ cursor: "pointer" }}>
                      {isSelected && <circle cx={x} cy={y} r={r + 4} fill="none" stroke={col} strokeWidth="1.2" opacity="0.4" />}
                      <circle cx={x} cy={y} r={r} fill={col} opacity={isSelected ? 1 : 0.75} stroke={isSelected ? col : "none"} strokeWidth="1.5" />
                      <text
                        x={x + off[0]} y={y + off[1]}
                        fontSize="7" fill={isSelected ? col : "#6a6260"}
                        fontFamily="Jost, sans-serif" fontWeight={isSelected ? "500" : "300"}
                        textAnchor={off[0] < 0 ? "end" : "start"}
                      >
                        {shortName}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend note */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid " + C.divider }}>
                <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>Tap any dot to apply to calculator</span>
                <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>5yr avg %/yr</span>
              </div>
            </div>

            {/* Detailed list */}
            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500" }}>
                  Lisbon — All Areas
                </div>
                <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.08em", fontWeight: "300" }}>
                  Sorted by 5yr outlook
                </div>
              </div>
              <div style={{ fontSize: "10px", color: C.textSub, fontWeight: "300", marginBottom: "18px", letterSpacing: "0.02em" }}>
                Established neighbourhoods and emerging areas combined
              </div>
              {allAreas.map((n, i) => {
                const maxGrowth = Math.max(...allAreas.map(a => a.growth));
                const barWidth = (Math.max(0, n.growth) / maxGrowth) * 100;
                const tagColors = {
                  Hottest:  { bg: "#f5ece0",    color: C.accent },
                  Emerging: { bg: C.goodLt,      color: C.good },
                  Rising:   { bg: "#eef2f8",     color: "#4a6080" },
                  Stable:   { bg: C.surfaceAlt,  color: C.textSub },
                  Mature:   { bg: C.surfaceAlt,  color: C.textMuted },
                  Cooling:  { bg: C.badLt,       color: C.bad },
                  Watch:    { bg: C.accentLt,    color: C.accent },
                };
                const tc = tagColors[n.tag] || tagColors.Stable;
                const isSelected = selectedArea && selectedArea.name === n.name;
                const phaseColor = n.phase ? ({
                  "Early Entry":   { bg: C.goodLt,    color: C.good },
                  "Rising":        { bg: C.goodLt,    color: C.good },
                  "Early Rising":  { bg: "#eef2f8",   color: "#4a6080" },
                  "Pre-Emergence": { bg: C.accentLt,  color: C.accent },
                  "Watch List":    { bg: C.surfaceAlt, color: C.textSub },
                }[n.phase] || { bg: C.surfaceAlt, color: C.textSub }) : null;
                const riskColor = n.risk === "Low" ? C.good : n.risk === "Moderate" ? C.accent : C.bad;
                const riskBg    = n.risk === "Low" ? C.goodLt : n.risk === "Moderate" ? C.accentLt : C.badLt;

                return (
                  <div key={n.name}
                    onClick={() => { setSelectedArea(n); setAppreciation(parseFloat(n.avg5yr.toFixed(1))); }}
                    style={{
                      borderBottom: i < allAreas.length - 1 ? "1px solid " + C.divider : "none",
                      cursor: "pointer",
                      background: isSelected ? C.accentLt : "transparent",
                      margin: isSelected ? "0 -22px" : "0",
                      padding: isSelected ? "14px 22px" : "14px 0",
                      borderLeft: isSelected ? "2px solid " + C.accent : "2px solid transparent",
                      paddingLeft: isSelected ? "20px" : "0",
                      transition: "all 0.2s",
                    }}>

                    {/* Name row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: C.text }}>
                          {n.name}
                        </span>
                        <span style={{
                          fontSize: "8px", fontWeight: "500", letterSpacing: "0.1em",
                          textTransform: "uppercase", padding: "2px 6px", borderRadius: "2px",
                          background: tc.bg, color: tc.color, fontFamily: "Jost, sans-serif",
                        }}>
                          {n.tag}
                        </span>
                        {n.phase && phaseColor && (
                          <span style={{
                            fontSize: "8px", fontWeight: "500", letterSpacing: "0.08em",
                            textTransform: "uppercase", padding: "2px 6px", borderRadius: "2px",
                            background: phaseColor.bg, color: phaseColor.color, fontFamily: "Jost, sans-serif",
                          }}>
                            {n.phase}
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "8px" }}>
                        <span style={{ fontSize: "14px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: n.growth < 0 ? C.bad : C.text }}>
                          {(n.growth >= 0 ? "+" : "") + n.growth + "%"}
                        </span>
                        <div style={{ fontSize: "8px", color: C.textMuted, fontWeight: "300", letterSpacing: "0.04em" }}>YoY</div>
                      </div>
                    </div>

                    {/* Growth bar */}
                    <div style={{ height: "2px", background: C.border, borderRadius: "2px", marginBottom: "8px" }}>
                      <div style={{
                        height: "100%", width: barWidth + "%",
                        background: n.growth < 0 ? C.bad : n.tag === "Hottest" ? C.accent : n.avg5yr >= 10 ? C.good : n.avg5yr >= 6 ? "#7a9a7a" : C.textMuted,
                        borderRadius: "2px", transition: "width 0.4s ease",
                      }} />
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", color: C.textMuted, fontWeight: "300" }}>{"EUR " + n.price + "/m\xB2"}</span>
                        <span style={{ fontSize: "10px", color: C.textMuted, fontWeight: "300" }}>{"Yield ~" + n.yieldPct + "%"}</span>
                        {n.score && (
                          <span style={{ fontSize: "10px", color: C.accent, fontWeight: "400" }}>{"Score " + n.score}</span>
                        )}
                      </div>
                      {isSelected
                        ? <span style={{ fontSize: "9px", color: C.accent, fontWeight: "500", letterSpacing: "0.08em" }}>Applied</span>
                        : <span style={{ fontSize: "9px", color: C.textMuted, fontWeight: "300", letterSpacing: "0.06em" }}>Tap to apply</span>
                      }
                    </div>

                    {/* 5yr sparkline box */}
                    <div style={{ background: isSelected ? "transparent" : C.surfaceAlt, border: "1px solid " + C.border, borderRadius: "3px", padding: "10px 12px", marginBottom: n.catalyst ? "10px" : "0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "500" }}>5-Year Outlook</span>
                        <span style={{ fontSize: "11px", fontFamily: "Cormorant Garamond, serif", fontWeight: "600", color: n.avg5yr >= 8 ? C.good : n.avg5yr >= 4 ? C.accent : C.bad }}>
                          {"Avg +" + n.avg5yr + "%/yr"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "32px", marginBottom: "4px" }}>
                        {n.forecast.map((val, fi) => {
                          const maxV = Math.max(...n.forecast, 1);
                          const minV = Math.min(...n.forecast, 0);
                          const range = maxV - minV || 1;
                          const barH = Math.max(2, ((val - minV) / range) * 28);
                          const barColor = val < 0 ? C.bad : val < 5 ? C.textMuted : val < 10 ? C.accent : C.good;
                          return (
                            <div key={fi} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                              <div style={{ width: "100%", height: barH + "px", background: barColor, borderRadius: "2px" }} />
                              <span style={{ fontSize: "8px", color: C.textMuted, fontWeight: "300" }}>{(2026 + fi).toString().slice(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        {n.forecast.map((val, fi) => (
                          <span key={fi} style={{ flex: 1, fontSize: "8px", color: val < 0 ? C.bad : C.textSub, fontWeight: "400", textAlign: "center" }}>
                            {(val >= 0 ? "+" : "") + val + "%"}
                          </span>
                        ))}
                      </div>
                      <p style={{ fontSize: "9px", color: C.textSub, margin: "4px 0 0", lineHeight: 1.5, fontWeight: "300" }}>{n.outlook}</p>
                    </div>

                    {/* Emerging area detail: catalyst + signals + risk */}
                    {n.catalyst && (
                      <div style={{ marginTop: "10px" }}>
                        <p style={{ fontSize: "10px", color: C.textSub, margin: "0 0 8px", lineHeight: 1.6, fontWeight: "300" }}>
                          {n.catalyst}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "8px" }}>
                          {n.signal.map((s, si) => (
                            <span key={si} style={{
                              fontSize: "9px", padding: "3px 8px", borderRadius: "2px",
                              background: C.surfaceAlt, color: C.textSub,
                              border: "1px solid " + C.border, fontWeight: "300",
                              fontFamily: "Jost, sans-serif",
                            }}>
                              {s}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "9px", color: C.textMuted, fontWeight: "400", letterSpacing: "0.06em" }}>Entry risk:</span>
                          <span style={{
                            fontSize: "8px", fontWeight: "500", padding: "2px 7px", borderRadius: "2px",
                            background: riskBg, color: riskColor,
                            letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Jost, sans-serif",
                          }}>
                            {n.risk}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Wave Pattern */}
            <div style={{ background: C.accentLt, border: "1px solid " + C.borderHov, borderRadius: "4px", padding: "14px 16px", marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "500", marginBottom: "8px" }}>
                The Wave Pattern
              </div>
              {[
                "2015-2018: Chiado and Bairro Alto mature, prices peak above EUR 7k/m\xB2",
                "2018-2022: Beato and Marvila absorb spillover demand, yields compress",
                "2022-2025: Beato surges +32%, Marvila cools. Metro suburbs ignite",
                "2026+: Almada, Barreiro, Moita and Arroios positioned for next wave",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 3 ? "8px" : "0", alignItems: "flex-start" }}>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                    background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "8px", color: "#fff", fontWeight: "600", fontFamily: "Jost, sans-serif",
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: "10px", color: C.textSub, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>{tip}</p>
                </div>
              ))}
            </div>

            <div style={{ background: C.surfaceAlt, border: "1px solid " + C.border, borderRadius: "4px", padding: "12px 16px" }}>
              <p style={{ fontSize: "9px", color: C.textMuted, margin: 0, lineHeight: 1.6, fontWeight: "300", letterSpacing: "0.02em" }}>
                Data: INE, Idealista 2025. Emerging area forecasts based on historical Lisbon gentrification wave patterns. Not financial advice.
              </p>
            </div>
          </div>
          );
        })()}

        {/* Risk Tab */}
        {tab === "risk" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "4px" }}>
                    Overall Risk
                  </div>
                  <div style={{
                    fontSize: "22px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500",
                    color: overallRisk === "High" ? C.bad : overallRisk === "Moderate" ? C.accent : C.good,
                  }}>
                    {overallRisk} Risk
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["Low", "Moderate", "High"].map((level) => (
                    <div key={level} style={{ textAlign: "center" }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: overallRisk === level
                          ? (level === "High" ? C.badLt : level === "Moderate" ? C.accentLt : C.goodLt)
                          : C.surfaceAlt,
                        border: "1px solid " + (overallRisk === level
                          ? (level === "High" ? C.bad : level === "Moderate" ? C.accent : C.good)
                          : C.border),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "9px", fontWeight: "500",
                        color: overallRisk === level
                          ? (level === "High" ? C.bad : level === "Moderate" ? C.accent : C.good)
                          : C.textMuted,
                        fontFamily: "Jost, sans-serif",
                        transition: "all 0.3s",
                      }}>
                        {level[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {risks.map((r, i) => {
                const riskColor = r.score === "High" ? C.bad : r.score === "Moderate" ? C.accent : C.good;
                const riskBg = r.score === "High" ? C.badLt : r.score === "Moderate" ? C.accentLt : C.goodLt;
                return (
                  <div key={r.label} style={{
                    padding: "14px 0",
                    borderBottom: i < risks.length - 1 ? "1px solid " + C.divider : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", color: C.text, fontWeight: "500", letterSpacing: "0.02em" }}>
                        {r.label}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: C.text }}>
                          {r.value}
                        </span>
                        <span style={{
                          fontSize: "8px", fontWeight: "500", letterSpacing: "0.1em",
                          textTransform: "uppercase", padding: "2px 7px", borderRadius: "2px",
                          background: riskBg, color: riskColor, fontFamily: "Jost, sans-serif",
                        }}>
                          {r.score}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: "10px", color: C.textSub, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>
                      {r.note}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ background: C.surfaceAlt, border: "1px solid " + C.border, borderRadius: "4px", padding: "14px 16px" }}>
              <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "500", marginBottom: "8px" }}>
                Risk Mitigation Tips
              </div>
              {[
                "Keep 3-6 months of mortgage payments in reserve",
                "Stress-test every deal at rate + 2% before buying",
                "Target DSCR above 1.25x for a comfortable safety margin",
                "Aim for break-even occupancy below 80%",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 3 ? "8px" : "0", alignItems: "flex-start" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.accent, marginTop: "5px", flexShrink: 0 }} />
                  <p style={{ fontSize: "10px", color: C.textSub, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button style={{
          width: "100%", padding: "16px",
          background: C.text,
          border: "none", borderRadius: "4px", fontSize: "10px",
          fontWeight: "500", color: C.bg, cursor: "pointer",
          fontFamily: "Jost, sans-serif", letterSpacing: "0.16em",
          textTransform: "uppercase",
          transition: "background 0.2s",
        }}
          onMouseEnter={(e) => e.target.style.background = C.accentDark}
          onMouseLeave={(e) => e.target.style.background = C.text}
        >
          Save This Analysis
        </button>

        <p style={{ textAlign: "center", fontSize: "10px", color: C.textMuted, marginTop: "16px", fontWeight: "300", letterSpacing: "0.02em" }}>
          For informational purposes only. Consult a financial advisor.
        </p>

      </div>
    </div>
  );
}
