import { useState, useEffect } from "react";

var fmt = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);

var pct = (n) => n.toFixed(1) + "%";

var C = {
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

function Slider(props) {
  var label=props.label, value=props.value, min=props.min, max=props.max, step=props.step, onChange=props.onChange, display=props.display;
  var fill = ((value - min) / (max - min)) * 100;
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

function MetricCard(props) {
  var label=props.label, value=props.value, sub=props.sub, accent=props.accent, positive=props.positive;
  var isGood = positive === true;
  var isBad = positive === false;
  var bg = accent ? C.accentLt : isGood ? C.goodLt : isBad ? C.badLt : C.surface;
  var border = accent ? C.borderHov : C.border;
  var valColor = accent ? C.accent : isGood ? C.good : isBad ? C.bad : C.text;
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

function Gauge(props) {
  var score=props.score;
  var angle = -135 + (score / 100) * 270;
  var color = score >= 70 ? C.good : score >= 40 ? C.accent : C.bad;
  var label = score >= 70 ? "Strong Buy" : score >= 40 ? "Consider" : "Avoid";
  var dash = (score / 100) * 172;
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
      <div style={{ fontSize: "32px", fontFamily: "Cormorant Garamond, serif", fontWeight: "300", color: color, lineHeight: 1, marginTop: "-6px", letterSpacing: "-0.02em" }}>
        {score}
      </div>
      <div style={{ fontSize: "9px", letterSpacing: "0.18em", color: color, textTransform: "uppercase", marginTop: "5px", fontFamily: "Jost, sans-serif", fontWeight: "500" }}>
        {label}
      </div>
    </div>
  );
}

var areaDotColor = n =>
  n.avg5yr >= 10 ? "#4a7059" : n.avg5yr >= 7 ? "#9e7c4a" : n.avg5yr >= 5 ? "#7a8a9a" : "#904a38";

var LISBON_DATA = [
  { name: "Beato",            growth: 32.3,  price: 4800, yieldPct: 6.2, tag: "Hottest",
    forecast: [18.0, 13.5, 10.0, 8.5, 7.5], avg5yr: 11.5,
    outlook: "Rapid cooling expected as prices normalise. Still strong mid-term but early buyers already won." },
  { name: "Campo de Ourique", growth: 14.8,  price: 6700, yieldPct: 4.8, tag: "Rising",
    forecast: [12.0, 10.5, 9.0, 8.0, 7.0], avg5yr: 9.3,
    outlook: "Sustained family-driven demand. Residential desirability keeps steady appreciation above city average." },
  { name: "Parque das Nacoes", growth: 12.1, price: 5840, yieldPct: 5.1, tag: "Rising",
    forecast: [10.0, 8.5, 7.5, 7.0, 6.5], avg5yr: 7.9,
    outlook: "Tech corridor presence anchors demand. Maturing but still outperforms Lisbon average." },
  { name: "Alcantara",        growth: 10.3,  price: 5100, yieldPct: 5.5, tag: "Rising",
    forecast: [9.5, 9.0, 8.0, 7.5, 7.0], avg5yr: 8.2,
    outlook: "Waterfront regeneration continues. Creative economy and proximity to Belem sustain momentum." },
  { name: "Estrela",          growth: 8.4,   price: 5490, yieldPct: 4.6, tag: "Stable",
    forecast: [7.5, 7.0, 6.5, 6.0, 6.0], avg5yr: 6.6,
    outlook: "Consistent blue-chip neighbourhood. Safe store of value but limited upside." },
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
    outlook: "Post-hype correction ongoing in 2026. Recovery expected by 2027-28. High yield compensates patient investors." },
  { name: "Almada",    growth: 18.2, price: 2800, yieldPct: 7.1, tag: "Emerging",
    forecast: [20.0, 16.0, 13.0, 11.0, 9.0], avg5yr: 13.8,
    outlook: "Metro expansion and Costa da Caparica beach access driving demand. Central Lisbon spillover.",
    catalyst: "Metro expansion + Costa da Caparica beach access. Central Lisbon spillover as prices hit EUR 6k/m2.",
    signal: ["Metro line extension confirmed", "Young professional inflow", "Lisbon ferry commuters relocating"],
    risk: "Low", phase: "Early Entry", score: 92 },
  { name: "Barreiro",  growth: 15.1, price: 2200, yieldPct: 7.6, tag: "Emerging",
    forecast: [16.0, 13.5, 11.0, 9.5, 8.0], avg5yr: 11.6,
    outlook: "Setubal Peninsula led national growth at +22.6% in 2025. Lower entry prices than Almada.",
    catalyst: "Setubal Peninsula led national growth at +22.6% in 2025. Waterfront regeneration.",
    signal: ["22.6% peninsula-wide growth in 2025", "Ferry link to Lisbon", "Industrial waterfront regeneration"],
    risk: "Low", phase: "Rising", score: 84 },
  { name: "Moita",     growth: 12.4, price: 1900, yieldPct: 8.2, tag: "Emerging",
    forecast: [14.0, 12.0, 10.5, 9.0, 8.0], avg5yr: 10.7,
    outlook: "Last truly affordable riverside municipality. Follows Barreiro trajectory from 3 years prior.",
    catalyst: "Last truly affordable riverside municipality. Developer interest confirmed.",
    signal: ["New residential development pipeline", "Institutional investor activity", "Infrastructure upgrades"],
    risk: "Moderate", phase: "Pre-Emergence", score: 87 },
  { name: "Arroios",   growth: 11.3, price: 4500, yieldPct: 5.8, tag: "Rising",
    forecast: [11.0, 10.0, 9.0, 8.5, 8.0], avg5yr: 9.3,
    outlook: "Inside city limits with affordable prices. Mirrors Intendente trajectory from 2019-2022.",
    catalyst: "Inside Lisbon city limits with still-affordable prices. Young international community forming.",
    signal: ["New co-working hubs opening", "Cafe and restaurant scene emerging", "Artist and expat community growing"],
    risk: "Low", phase: "Early Rising", score: 79 },
  { name: "Olivais",   growth: 8.7,  price: 3200, yieldPct: 6.4, tag: "Rising",
    forecast: [10.0, 9.0, 8.0, 7.5, 7.0], avg5yr: 8.3,
    outlook: "Adjacent to Beato and Parque das Nacoes. Benefits from Beato tech hub spillover.",
    catalyst: "Adjacent to Beato and Parque das Nacoes. Underpriced relative to neighbours.",
    signal: ["Proximity to Beato tech corridor", "Metro Red Line access", "Price gap narrowing"],
    risk: "Moderate", phase: "Pre-Emergence", score: 76 },
  { name: "Alcochete", growth: 9.3,  price: 2100, yieldPct: 7.8, tag: "Watch",
    forecast: [9.0, 8.5, 8.0, 7.5, 7.0], avg5yr: 8.0,
    outlook: "New international school attracting expat families. Montijo airport proximity creating demand.",
    catalyst: "New international school attracting expat families. Road improvements and Montijo airport proximity.",
    signal: ["New international school opened", "Montijo airport proximity", "Improved road connections"],
    risk: "Moderate", phase: "Watch List", score: 71 },
].sort((a, b) => b.avg5yr - a.avg5yr);

var ALL_AREAS = LISBON_DATA;

var AREA_CENTROIDS = {
  "Beato":             [38.725, -9.108],
  "Campo de Ourique":  [38.714, -9.165],
  "Parque das Nacoes": [38.766, -9.094],
  "Alcantara":         [38.697, -9.186],
  "Estrela":           [38.712, -9.162],
  "Santo Antonio":     [38.718, -9.142],
  "Misericordia":      [38.710, -9.144],
  "Avenidas Novas":    [38.738, -9.148],
  "Chiado":            [38.711, -9.143],
  "Marvila":           [38.738, -9.111],
  "Arroios":           [38.723, -9.134],
  "Olivais":           [38.750, -9.108],
  "Almada":            [38.678, -9.157],
  "Barreiro":          [38.657, -9.072],
  "Moita":             [38.638, -9.020],
  "Alcochete":         [38.752, -8.962],
};

var CHART_X_MIN = 2, CHART_X_MAX = 15, CHART_Y_MIN = 3, CHART_Y_MAX = 9;
var CHART_PL = 36, CHART_PR = 308, CHART_PT = 12, CHART_PB = 162;
var chartCx = v => CHART_PL + (v - CHART_X_MIN) / (CHART_X_MAX - CHART_X_MIN) * (CHART_PR - CHART_PL);
var chartCy = v => CHART_PB - (v - CHART_Y_MIN) / (CHART_Y_MAX - CHART_Y_MIN) * (CHART_PB - CHART_PT);
var CHART_X_MID = 8, CHART_Y_MID = 6;

var LABEL_OFFSETS = {
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

function LisbonMap(props) {
  var selectedName=props.selectedName, onSelect=props.onSelect;
  var [tooltip, setTooltip] = useState(null);
  var LNG_MIN = -9.26, LNG_MAX = -8.93;
  var LAT_MIN = 38.59, LAT_MAX = 38.85;
  var W = 320, H = 240;
  var px = lng => (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * W;
  var py = lat => (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;

  var riverNorth = [
    [px(-9.230), py(38.705)], [px(-9.210), py(38.704)], [px(-9.195), py(38.703)],
    [px(-9.182), py(38.700)], [px(-9.165), py(38.706)], [px(-9.150), py(38.707)],
    [px(-9.135), py(38.706)], [px(-9.115), py(38.710)], [px(-9.095), py(38.715)],
    [px(-9.060), py(38.720)], [px(-9.020), py(38.718)], [px(-8.960), py(38.728)],
  ];
  var riverSouth = [
    [px(-8.960), py(38.680)], [px(-9.010), py(38.670)], [px(-9.040), py(38.663)],
    [px(-9.065), py(38.655)], [px(-9.090), py(38.648)], [px(-9.115), py(38.645)],
    [px(-9.140), py(38.648)], [px(-9.160), py(38.652)], [px(-9.175), py(38.656)],
    [px(-9.195), py(38.664)], [px(-9.220), py(38.670)], [px(-9.250), py(38.678)],
  ];
  var riverPts = riverNorth.concat(riverSouth.slice().reverse());
  var riverPath = riverPts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + " Z";

  var mapLbl = {
    "Beato":             [6, -7, "start"],
    "Campo de Ourique":  [-5, 9, "end"],
    "Parque das Nacoes": [6, -7, "start"],
    "Alcantara":         [-5, 9, "end"],
    "Estrela":           [-5, -8, "end"],
    "Santo Antonio":     [6, -7, "start"],
    "Misericordia":      [6, 8, "start"],
    "Avenidas Novas":    [-5, -8, "end"],
    "Chiado":            [-5, 9, "end"],
    "Marvila":           [-5, -8, "end"],
    "Arroios":           [6, 5, "start"],
    "Olivais":           [6, -7, "start"],
    "Almada":            [-5, 9, "end"],
    "Barreiro":          [5, 8, "start"],
    "Moita":             [-5, -8, "end"],
    "Alcochete":         [-5, -8, "end"],
  };
  var shortName = name =>
    name === "Campo de Ourique" ? "Campo O." :
    name === "Avenidas Novas"   ? "Av. Novas" :
    name === "Parque das Nacoes"? "Parque N." :
    name === "Santo Antonio"    ? "Sto. Antonio" : name;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", display: "block", borderRadius: "3px" }}>
        <rect width={W} height={H} fill="#f0ece4" />
        <path d={riverPath} fill="#aec8d8" opacity="0.85" />
        <text x={px(-9.08)} y={py(38.682)} fontSize="7" fill="#6899b0" fontFamily="Jost, sans-serif"
          fontWeight="300" letterSpacing="0.1em" transform={"rotate(-4," + px(-9.08) + "," + py(38.682) + ")"}>
          RIO TEJO
        </text>
        <g transform={"translate(" + (W - 18) + ",14)"}>
          <circle r="9" fill="white" fillOpacity="0.75" stroke="#c8c0b8" strokeWidth="0.8" />
          <text textAnchor="middle" y="4" fontSize="8" fill="#9e7c4a" fontWeight="600">N</text>
        </g>
        {ALL_AREAS.map(area => {
          var c = AREA_CENTROIDS[area.name];
          if (!c) return null;
          var x = px(c[1]), y = py(c[0]);
          var col = areaDotColor(area);
          var isSel = selectedName === area.name;
          var off = mapLbl[area.name] || [6, -7, "start"];
          return (
            <g key={area.name} onClick={() => onSelect(area)}
              onMouseEnter={() => setTooltip({ name: area.name, avg5yr: area.avg5yr, yieldPct: area.yieldPct, x: x, y: y })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}>
              {isSel && <circle cx={x} cy={y} r={11} fill="none" stroke={col} strokeWidth="1.2" opacity="0.3" />}
              <circle cx={x} cy={y} r={isSel ? 7 : 5} fill={col} opacity={isSel ? 1 : 0.78} stroke="white" strokeWidth={isSel ? 1.5 : 1} />
              <text x={x + off[0]} y={y + off[1]} fontSize="6.5" fill={isSel ? col : "#5c5250"}
                fontFamily="Jost, sans-serif" fontWeight={isSel ? "500" : "300"} textAnchor={off[2]}>
                {shortName(area.name)}
              </text>
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div style={{
          position: "absolute",
          left: (tooltip.x / W * 100) + "%",
          top: (tooltip.y / H * 100) + "%",
          transform: "translate(-50%, -120%)",
          background: "white", border: "1px solid #d8cfc6", borderRadius: "3px",
          padding: "5px 8px", fontSize: "10px", fontFamily: "Jost, sans-serif",
          pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontWeight: "500", color: "#2c2420", marginBottom: "2px" }}>{tooltip.name}</div>
          <div style={{ color: "#8a7870" }}>{"5yr avg: +" + tooltip.avg5yr + "%/yr  |  Yield " + tooltip.yieldPct + "%"}</div>
        </div>
      )}
    </div>
  );
}

export default function ROICalculator() {
  var [price, setPrice] = useState(650000);
  var [rent, setRent] = useState(2800);
  var [downPct, setDownPct] = useState(20);
  var [rate, setRate] = useState(5.5);
  var [expenses, setExpenses] = useState(400);
  var [appreciation, setAppreciation] = useState(3);
  var [tab, setTab] = useState("calculator");
  var [marketSubTab, setMarketSubTab] = useState("matrix");
  var [ready, setReady] = useState(false);
  var [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    setTimeout(() => setReady(true), 80);
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  var down = price * (downPct / 100);
  var loan = price - down;
  var mo = rate / 100 / 12;
  var n = 25 * 12;
  var mortgage = loan * (mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);
  var cashFlow = rent - mortgage - expenses;
  var annualCashFlow = cashFlow * 12;
  var grossYield = (rent * 12 / price) * 100;
  var capRate = ((rent - expenses) * 12 / price) * 100;
  var annualAppreciation = price * (appreciation / 100);
  var roi = ((annualCashFlow + annualAppreciation) / down) * 100;

  var score = Math.min(100, Math.max(0, Math.round(
    (grossYield > 6 ? 30 : grossYield > 4 ? 20 : 10) +
    (cashFlow > 500 ? 30 : cashFlow > 0 ? 20 : cashFlow > -300 ? 5 : 0) +
    (roi > 15 ? 25 : roi > 8 ? 18 : roi > 0 ? 10 : 0) +
    (capRate > 5 ? 15 : capRate > 3 ? 10 : 5)
  )));

  var ltv = ((loan / price) * 100);
  var dscr = (rent * 12) / (mortgage * 12);
  var breakEvenOccupancy = (mortgage + expenses) / rent * 100;
  var stressRate = rate + 2;
  var stressMo = stressRate / 100 / 12;
  var stressMortgage = loan * (stressMo * Math.pow(1 + stressMo, n)) / (Math.pow(1 + stressMo, n) - 1);
  var stressCashFlow = rent - stressMortgage - expenses;
  var vacancyImpact = rent * 0.08 * 12;

  var risks = [
    {
      label: "Leverage (LTV)", value: ltv.toFixed(0) + "%",
      score: ltv > 80 ? "High" : ltv > 65 ? "Moderate" : "Low",
      note: ltv > 80 ? "High exposure - small price drops erode equity fast" : ltv > 65 ? "Moderate leverage, manageable if rates rise" : "Conservative leverage with good equity buffer",
    },
    {
      label: "Debt Coverage (DSCR)", value: dscr.toFixed(2) + "x",
      score: dscr < 1.1 ? "High" : dscr < 1.3 ? "Moderate" : "Low",
      note: dscr < 1.1 ? "Rent barely covers debt - one vacancy could cause distress" : dscr < 1.3 ? "Adequate coverage but limited cushion" : "Strong coverage ratio - resilient to vacancy",
    },
    {
      label: "Break-even Occupancy", value: Math.min(breakEvenOccupancy, 100).toFixed(0) + "%",
      score: breakEvenOccupancy > 90 ? "High" : breakEvenOccupancy > 75 ? "Moderate" : "Low",
      note: breakEvenOccupancy > 90 ? "Need near-full occupancy to stay cash-flow positive" : breakEvenOccupancy > 75 ? "Tolerates some vacancy but limited runway" : "Can sustain significant vacancy and remain profitable",
    },
    {
      label: "Rate Stress Test (+2%)", value: fmt(stressCashFlow) + "/mo",
      score: stressCashFlow < -500 ? "High" : stressCashFlow < 0 ? "Moderate" : "Low",
      note: stressCashFlow < -500 ? "Deeply negative if rates rise 2% - refinancing risk is real" : stressCashFlow < 0 ? "Negative cash flow under rate stress - monitor closely" : "Remains positive even in a rate shock scenario",
    },
    {
      label: "Vacancy Cost Exposure", value: fmt(vacancyImpact) + "/yr",
      score: vacancyImpact > annualCashFlow * 0.5 ? "High" : vacancyImpact > annualCashFlow * 0.25 ? "Moderate" : "Low",
      note: "One month vacancy per year costs " + fmt(vacancyImpact) + ". Maintain a reserve fund to cover this.",
    },
  ];

  var riskCounts = risks.reduce((a, r) => { a[r.score] = (a[r.score] || 0) + 1; return a; }, {});
  var overallRisk = riskCounts["High"] >= 3 ? "High" : (riskCounts["High"] >= 1 || riskCounts["Moderate"] >= 3) ? "Moderate" : "Low";
  var allAreas = ALL_AREAS;
  var rows = [
    { label: "Rental Income", value: rent, positive: true },
    { label: "Mortgage Payment", value: -mortgage, positive: false },
    { label: "Operating Expenses", value: -expenses, positive: false },
    { label: "Net Cash Flow", value: cashFlow, bold: true, positive: cashFlow >= 0 },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "Jost, sans-serif",
      display: "flex", justifyContent: "center", padding: "32px 16px",
    }}>
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

        {/* Row 1: Markets tab */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "0" }}>
          <button onClick={() => setTab("markets")} style={{
            flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer",
            fontSize: "10px", fontWeight: tab === "markets" ? "500" : "400",
            textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "Jost, sans-serif",
            color: tab === "markets" ? C.accent : C.textSub,
            borderBottom: tab === "markets" ? "2px solid " + C.accent : "2px solid transparent",
            marginBottom: "-1px", transition: "all 0.2s",
          }}>
            Markets
          </button>
        </div>

        {/* Row 2: Deal analysis tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "16px" }}>
          {["calculator", "breakdown", "projection", "risk"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer",
              fontSize: "10px", fontWeight: tab === t ? "500" : "400",
              textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "Jost, sans-serif",
              color: tab === t ? C.accent : C.textSub,
              borderBottom: tab === t ? "2px solid " + C.accent : "2px solid transparent",
              marginBottom: "-1px", transition: "all 0.2s",
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Score Gauge */}
        {tab !== "markets" && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <Gauge score={score} />
          </div>
        )}

        {/* Markets Tab */}
        {tab === "markets" && (
          <div style={{ marginBottom: "16px" }}>
            {/* Market sub-tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "16px" }}>
              {[["matrix","Matrix"],["map","Map"],["list","All Areas"]].map((item) => {
                var key = item[0], label = item[1];
                return <button key={key} onClick={() => setMarketSubTab(key)} style={{
                  flex: 1, padding: "9px 0", border: "none", background: "transparent", cursor: "pointer",
                  fontSize: "9px", fontWeight: marketSubTab === key ? "500" : "400",
                  textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "Jost, sans-serif",
                  color: marketSubTab === key ? C.accent : C.textSub,
                  borderBottom: marketSubTab === key ? "2px solid " + C.accent : "2px solid transparent",
                  marginBottom: "-1px", transition: "all 0.2s",
                }}>
                  {label}
                </button>;
              })}
            </div>

            {/* Matrix sub-tab */}
            {marketSubTab === "matrix" && (
              <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "16px 18px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "3px" }}>
                      Opportunity Matrix
                    </div>
                    <div style={{ fontSize: "10px", color: C.textSub, fontWeight: "300" }}>Gross yield vs. 5yr growth forecast</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-end" }}>
                    {[["#4a7059","High growth"],["#9e7c4a","Mid growth"],["#7a8a9a","Low growth"],["#904a38","Slow"]].map((pair) => {
                      var col = pair[0], lbl = pair[1]; return (
                      <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: col }} />
                        <span style={{ fontSize: "8px", color: C.textMuted, fontWeight: "300" }}>{lbl}</span>
                      </div>
                    ); })}
                  </div>
                </div>
                <svg viewBox="0 0 320 178" style={{ width: "100%", fontFamily: "Jost, sans-serif", overflow: "visible" }}>
                  <rect x={chartCx(CHART_X_MID)} y={CHART_PT} width={CHART_PR - chartCx(CHART_X_MID)} height={chartCy(CHART_Y_MID) - CHART_PT} fill="#f0f4f0" opacity="0.7" />
                  <rect x={CHART_PL} y={chartCy(CHART_Y_MID)} width={chartCx(CHART_X_MID) - CHART_PL} height={CHART_PB - chartCy(CHART_Y_MID)} fill="#f7f4f0" opacity="0.7" />
                  <rect x={chartCx(CHART_X_MID)} y={chartCy(CHART_Y_MID)} width={CHART_PR - chartCx(CHART_X_MID)} height={CHART_PB - chartCy(CHART_Y_MID)} fill="#fdf6ee" opacity="0.7" />
                  <rect x={CHART_PL} y={CHART_PT} width={chartCx(CHART_X_MID) - CHART_PL} height={chartCy(CHART_Y_MID) - CHART_PT} fill="#f5f2f0" opacity="0.4" />
                  <line x1={chartCx(CHART_X_MID)} y1={CHART_PT} x2={chartCx(CHART_X_MID)} y2={CHART_PB} stroke="#d8cfc6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={CHART_PL} y1={chartCy(CHART_Y_MID)} x2={CHART_PR} y2={chartCy(CHART_Y_MID)} stroke="#d8cfc6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={CHART_PL} y1={CHART_PB} x2={CHART_PR} y2={CHART_PB} stroke="#c8bfb6" strokeWidth="1" />
                  <line x1={CHART_PL} y1={CHART_PT} x2={CHART_PL} y2={CHART_PB} stroke="#c8bfb6" strokeWidth="1" />
                  {[4,6,8,10,12,14].map(v => (
                    <g key={v}>
                      <line x1={chartCx(v)} y1={CHART_PB} x2={chartCx(v)} y2={CHART_PB+3} stroke="#b8b0a8" strokeWidth="0.8" />
                      <text x={chartCx(v)} y={CHART_PB+9} textAnchor="middle" fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif">{v+"%"}</text>
                    </g>
                  ))}
                  {[4,5,6,7,8].map(v => (
                    <g key={v}>
                      <line x1={CHART_PL-3} y1={chartCy(v)} x2={CHART_PL} y2={chartCy(v)} stroke="#b8b0a8" strokeWidth="0.8" />
                      <text x={CHART_PL-5} y={chartCy(v)+2.5} textAnchor="end" fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif">{v+"%"}</text>
                    </g>
                  ))}
                  <text x={(CHART_PL+CHART_PR)/2} y={CHART_PB+19} textAnchor="middle" fontSize="7.5" fill="#9e7c4a" fontFamily="Jost, sans-serif" letterSpacing="0.1em" fontWeight="500">5-YEAR GROWTH FORECAST</text>
                  <text transform={"rotate(-90,"+(CHART_PL-22)+","+((CHART_PT+CHART_PB)/2)+")"} x={CHART_PL-22} y={(CHART_PT+CHART_PB)/2+2.5} textAnchor="middle" fontSize="7.5" fill="#9e7c4a" fontFamily="Jost, sans-serif" letterSpacing="0.1em" fontWeight="500">GROSS YIELD</text>
                  <text x={chartCx(CHART_X_MID)+6} y={CHART_PT+8} fontSize="7" fill="#4a7059" fontFamily="Jost, sans-serif" fontWeight="500" letterSpacing="0.08em">SWEET SPOT</text>
                  <text x={CHART_PL+4} y={CHART_PT+8} fontSize="7" fill="#7a8a9a" fontFamily="Jost, sans-serif" fontWeight="400" letterSpacing="0.08em">INCOME</text>
                  <text x={chartCx(CHART_X_MID)+6} y={CHART_PB-4} fontSize="7" fill="#9e7c4a" fontFamily="Jost, sans-serif" fontWeight="400" letterSpacing="0.08em">GROWTH</text>
                  <text x={CHART_PL+4} y={CHART_PB-4} fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif" fontWeight="400" letterSpacing="0.08em">MATURE</text>
                  {allAreas.map(a => {
                    var x = chartCx(a.avg5yr), y = chartCy(a.yieldPct);
                    var col = areaDotColor(a);
                    var isSel = selectedArea && selectedArea.name === a.name;
                    var r = isSel ? 6.5 : 5;
                    var off = LABEL_OFFSETS[a.name] || [6, -8];
                    var sn = a.name.length > 9 ? a.name.split(" ")[0] : a.name;
                    return (
                      <g key={a.name} onClick={() => { setSelectedArea(a); setAppreciation(parseFloat(a.avg5yr.toFixed(1))); }} style={{ cursor: "pointer" }}>
                        {isSel && <circle cx={x} cy={y} r={r+4} fill="none" stroke={col} strokeWidth="1.2" opacity="0.4" />}
                        <circle cx={x} cy={y} r={r} fill={col} opacity={isSel ? 1 : 0.75} stroke={isSel ? col : "none"} strokeWidth="1.5" />
                        <text x={x+off[0]} y={y+off[1]} fontSize="7" fill={isSel ? col : "#6a6260"} fontFamily="Jost, sans-serif" fontWeight={isSel ? "500" : "300"} textAnchor={off[0] < 0 ? "end" : "start"}>{sn}</text>
                      </g>
                    );
                  })}
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid " + C.divider }}>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>Tap any dot to apply to calculator</span>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>5yr avg %/yr</span>
                </div>
              </div>
            )}

            {/* Map sub-tab */}
            {marketSubTab === "map" && (
              <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "16px 18px", marginBottom: "12px" }}>
                <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "3px" }}>
                  Lisbon Region Map
                </div>
                <div style={{ fontSize: "10px", color: C.textSub, fontWeight: "300", marginBottom: "12px" }}>Geographic distribution - tap to select</div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                  {[["#4a7059",">=10%/yr"],["#9e7c4a","7-10%"],["#7a8a9a","5-7%"],["#904a38","<5%"]].map((pair) => {
                    var col = pair[0], lbl = pair[1]; return (
                    <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: col }} />
                      <span style={{ fontSize: "7.5px", color: C.textMuted, fontWeight: "300" }}>{lbl}</span>
                    </div>
                  ); })}
                </div>
                <LisbonMap
                  selectedName={selectedArea && selectedArea.name}
                  onSelect={a => { setSelectedArea(a); setAppreciation(parseFloat(a.avg5yr.toFixed(1))); }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid " + C.divider }}>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>Dot colour = 5yr growth tier</span>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>INE / Idealista 2025</span>
                </div>
              </div>
            )}

            {/* List sub-tab */}
            {marketSubTab === "list" && (
              <div>
                <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "18px" }}>
                    <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500" }}>Lisbon - All Areas</div>
                    <div style={{ fontSize: "9px", color: C.textMuted, fontWeight: "300" }}>Sorted by 5yr outlook</div>
                  </div>
                  {allAreas.map((a, i) => {
                    var maxG = Math.max(...allAreas.map(x => x.growth));
                    var barW = (Math.max(0, a.growth) / maxG) * 100;
                    var tagC = { Hottest: { bg: "#f5ece0", color: C.accent }, Emerging: { bg: C.goodLt, color: C.good }, Rising: { bg: "#eef2f8", color: "#4a6080" }, Stable: { bg: C.surfaceAlt, color: C.textSub }, Mature: { bg: C.surfaceAlt, color: C.textMuted }, Cooling: { bg: C.badLt, color: C.bad }, Watch: { bg: C.accentLt, color: C.accent } };
                    var tc = tagC[a.tag] || tagC.Stable;
                    var isSel = selectedArea && selectedArea.name === a.name;
                    return (
                      <div key={a.name} onClick={() => { setSelectedArea(a); setAppreciation(parseFloat(a.avg5yr.toFixed(1))); }}
                        style={{ borderBottom: i < allAreas.length-1 ? "1px solid "+C.divider : "none", cursor: "pointer", padding: "14px 0", background: isSel ? C.accentLt : "transparent", borderLeft: isSel ? "2px solid "+C.accent : "2px solid transparent", paddingLeft: isSel ? "8px" : "0", transition: "all 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: C.text }}>{a.name}</span>
                            <span style={{ fontSize: "8px", fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 6px", borderRadius: "2px", background: tc.bg, color: tc.color }}>{a.tag}</span>
                          </div>
                          <span style={{ fontSize: "14px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: a.growth < 0 ? C.bad : C.text }}>{(a.growth >= 0 ? "+" : "") + a.growth + "%"}</span>
                        </div>
                        <div style={{ height: "2px", background: C.border, borderRadius: "2px", marginBottom: "6px" }}>
                          <div style={{ height: "100%", width: barW+"%", background: a.growth < 0 ? C.bad : a.avg5yr >= 10 ? C.good : a.avg5yr >= 6 ? "#7a9a7a" : C.textMuted, borderRadius: "2px" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <span style={{ fontSize: "10px", color: C.textMuted, fontWeight: "300" }}>{"EUR " + a.price + "/m2"}</span>
                            <span style={{ fontSize: "10px", color: C.textMuted, fontWeight: "300" }}>{"Yield ~" + a.yieldPct + "%"}</span>
                          </div>
                          <span style={{ fontSize: "9px", color: isSel ? C.accent : C.textMuted, fontWeight: isSel ? "500" : "300" }}>{isSel ? "Applied" : "Tap to apply"}</span>
                        </div>
                        <div style={{ background: C.surfaceAlt, border: "1px solid "+C.border, borderRadius: "3px", padding: "8px 10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "9px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500" }}>5-Year Outlook</span>
                            <span style={{ fontSize: "11px", fontFamily: "Cormorant Garamond, serif", fontWeight: "600", color: a.avg5yr >= 8 ? C.good : a.avg5yr >= 4 ? C.accent : C.bad }}>{"Avg +" + a.avg5yr + "%/yr"}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "28px", marginBottom: "4px" }}>
                            {a.forecast.map((val, fi) => {
                              var maxV = Math.max(...a.forecast, 1);
                              var minV = Math.min(...a.forecast, 0);
                              var barH = Math.max(2, ((val - minV) / (maxV - minV || 1)) * 24);
                              return (
                                <div key={fi} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                  <div style={{ width: "100%", height: barH+"px", background: val < 0 ? C.bad : val < 5 ? C.textMuted : val < 10 ? C.accent : C.good, borderRadius: "2px" }} />
                                  <span style={{ fontSize: "7px", color: C.textMuted }}>{(2026+fi).toString().slice(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                          <p style={{ fontSize: "9px", color: C.textSub, margin: "4px 0 0", lineHeight: 1.5, fontWeight: "300" }}>{a.outlook}</p>
                        </div>
                        {a.catalyst && (
                          <div style={{ marginTop: "8px" }}>
                            <p style={{ fontSize: "10px", color: C.textSub, margin: "0 0 6px", lineHeight: 1.6, fontWeight: "300" }}>{a.catalyst}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                              {a.signal.map((s, si) => (
                                <span key={si} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "2px", background: C.surfaceAlt, color: C.textSub, border: "1px solid "+C.border, fontWeight: "300" }}>{s}</span>
                              ))}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "9px", color: C.textMuted }}>Entry risk:</span>
                              <span style={{ fontSize: "8px", fontWeight: "500", padding: "2px 7px", borderRadius: "2px", background: a.risk === "Low" ? C.goodLt : a.risk === "Moderate" ? C.accentLt : C.badLt, color: a.risk === "Low" ? C.good : a.risk === "Moderate" ? C.accent : C.bad, letterSpacing: "0.1em", textTransform: "uppercase" }}>{a.risk}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ background: C.accentLt, border: "1px solid "+C.borderHov, borderRadius: "4px", padding: "14px 16px", marginBottom: "10px" }}>
                  <div style={{ fontSize: "9px", color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "500", marginBottom: "8px" }}>The Wave Pattern</div>
                  {["2015-2018: Chiado and Bairro Alto mature, prices peak above EUR 7k/m2","2018-2022: Beato and Marvila absorb spillover demand, yields compress","2022-2025: Beato surges +32%, Marvila cools. Metro suburbs ignite","2026+: Almada, Barreiro, Moita and Arroios positioned for next wave"].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 3 ? "8px" : "0", alignItems: "flex-start" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#fff", fontWeight: "600" }}>{i+1}</div>
                      <p style={{ fontSize: "10px", color: C.textSub, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>{tip}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.surfaceAlt, border: "1px solid "+C.border, borderRadius: "4px", padding: "12px 16px" }}>
                  <p style={{ fontSize: "9px", color: C.textMuted, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>Data: INE, Idealista 2025. Emerging area forecasts based on historical Lisbon gentrification wave patterns. Not financial advice.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Tab */}
        {tab === "calculator" && (
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "24px 22px", marginBottom: "12px" }}>
            <Slider label="Purchase Price" value={price} min={200000} max={5000000} step={10000} onChange={setPrice} display={"EUR " + Math.round(price/1000) + "k"} />
            <Slider label="Monthly Rent" value={rent} min={500} max={15000} step={50} onChange={setRent} display={"EUR " + rent + "/mo"} />
            <Slider label="Down Payment" value={downPct} min={5} max={40} step={1} onChange={setDownPct} display={downPct + "%"} />
            <Slider label="Mortgage Rate" value={rate} min={2} max={10} step={0.1} onChange={setRate} display={rate + "%"} />
            <Slider label="Monthly Expenses" value={expenses} min={0} max={2000} step={50} onChange={setExpenses} display={"EUR " + expenses + "/mo"} />
            <div style={{ position: "relative" }}>
              <Slider label="Annual Appreciation" value={appreciation} min={-20} max={35} step={0.1} onChange={v => { setAppreciation(v); setSelectedArea(null); }} display={appreciation + "%/yr"} />
              {selectedArea && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "-12px", marginBottom: "16px", padding: "6px 10px", borderRadius: "3px", background: C.accentLt, border: "1px solid " + C.borderHov }}>
                  <span style={{ fontSize: "9px", color: C.accent, fontWeight: "500" }}>{"Using " + selectedArea.name + " 5yr avg forecast (+" + selectedArea.avg5yr + "%/yr avg)"}</span>
                  <button onClick={() => { setSelectedArea(null); setAppreciation(3); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: "12px", padding: "0 0 0 8px" }}>x</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Breakdown Tab */}
        {tab === "breakdown" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <MetricCard label="Monthly Cash Flow" value={fmt(cashFlow)} sub="after mortgage + expenses" accent={false} positive={cashFlow >= 0} />
              <MetricCard label="Annual ROI" value={pct(roi)} sub={"on " + fmt(down) + " down"} accent={true} positive={roi >= 0} />
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <MetricCard label="Gross Yield" value={pct(grossYield)} sub="annual rent / price" accent={false} positive={grossYield >= 5} />
              <MetricCard label="Cap Rate" value={pct(capRate)} sub="net income / price" accent={false} positive={capRate >= 4} />
            </div>
            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px" }}>
              <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "16px" }}>Monthly Breakdown</div>
              {rows.map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderBottom: row.bold ? "none" : "1px solid " + C.divider, marginTop: row.bold ? "4px" : "0" }}>
                  <span style={{ fontSize: "12px", color: row.bold ? C.text : C.textSub, fontWeight: row.bold ? "500" : "300" }}>{row.label}</span>
                  <span style={{ fontSize: row.bold ? "16px" : "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: row.bold ? "500" : "400", color: row.bold ? (cashFlow >= 0 ? C.good : C.bad) : row.positive ? C.good : C.bad }}>{fmt(Math.abs(row.value))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projection Tab */}
        {tab === "projection" && (
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px", marginBottom: "12px" }}>
            <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "20px" }}>Property Projection</div>
            {[1, 2, 3, 5].map((yr, i) => {
              var futureVal = price * Math.pow(1 + appreciation / 100, yr);
              var totalCash = annualCashFlow * yr;
              var totalProfit = totalCash + (futureVal - price);
              var positive = totalProfit > 0;
              return (
                <div key={yr} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: i < 3 ? "1px solid " + C.divider : "none" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0, background: C.accentLt, border: "1px solid " + C.borderHov, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "500", color: C.accent, fontFamily: "Jost, sans-serif" }}>{"Y" + yr}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: C.text }}>{fmt(futureVal)}</div>
                    <div style={{ fontSize: "10px", color: C.textMuted, fontWeight: "300", marginTop: "2px" }}>{"Cash: " + fmt(totalCash) + "  /  Gain: " + fmt(totalProfit)}</div>
                  </div>
                  <div style={{ fontSize: "14px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: positive ? C.good : C.bad }}>{positive ? "+" : ""}{fmt(totalProfit)}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Risk Tab */}
        {tab === "risk" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "20px 22px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "4px" }}>Overall Risk</div>
                  <div style={{ fontSize: "22px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: overallRisk === "High" ? C.bad : overallRisk === "Moderate" ? C.accent : C.good }}>{overallRisk} Risk</div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["Low","Moderate","High"].map(level => (
                    <div key={level} style={{ textAlign: "center" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: overallRisk === level ? (level === "High" ? C.badLt : level === "Moderate" ? C.accentLt : C.goodLt) : C.surfaceAlt, border: "1px solid " + (overallRisk === level ? (level === "High" ? C.bad : level === "Moderate" ? C.accent : C.good) : C.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "500", color: overallRisk === level ? (level === "High" ? C.bad : level === "Moderate" ? C.accent : C.good) : C.textMuted, fontFamily: "Jost, sans-serif", transition: "all 0.3s" }}>{level[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
              {risks.map((r, i) => {
                var riskColor = r.score === "High" ? C.bad : r.score === "Moderate" ? C.accent : C.good;
                var riskBg = r.score === "High" ? C.badLt : r.score === "Moderate" ? C.accentLt : C.goodLt;
                return (
                  <div key={r.label} style={{ padding: "14px 0", borderBottom: i < risks.length-1 ? "1px solid "+C.divider : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", color: C.text, fontWeight: "400" }}>{r.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: C.text }}>{r.value}</span>
                        <span style={{ fontSize: "8px", fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "2px", background: riskBg, color: riskColor }}>{r.score}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "10px", color: C.textSub, margin: 0, lineHeight: 1.5, fontWeight: "300" }}>{r.note}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.surfaceAlt, border: "1px solid "+C.border, borderRadius: "4px", padding: "16px 18px" }}>
              <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "500", marginBottom: "10px" }}>Risk Mitigation Tips</div>
              {["Keep 3-6 months of mortgage payments in reserve","Stress-test every deal at rate + 2% before buying","Target DSCR above 1.25x for a comfortable safety margin","Aim for break-even occupancy below 80%"].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 3 ? "8px" : "0", alignItems: "flex-start" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.accent, marginTop: "5px", flexShrink: 0 }} />
                  <p style={{ fontSize: "10px", color: C.textSub, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          style={{ width: "100%", padding: "16px", background: C.text, border: "none", borderRadius: "4px", fontSize: "10px", fontWeight: "500", color: C.bg, cursor: "pointer", fontFamily: "Jost, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", transition: "background 0.2s" }}
          onMouseEnter={function(e){ e.target.style.background = C.accentDark; }}
          onMouseLeave={function(e){ e.target.style.background = C.text; }}
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

