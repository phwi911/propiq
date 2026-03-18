import { useState, useEffect } from "react";
 
var SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
var SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;
 
function fetchAreas() {
  return fetch(SUPABASE_URL + "/rest/v1/areas?select=*&order=avg5yr.desc", {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
    }
  })
  .then(function(r) { return r.json(); })
  .then(function(rows) {
    return rows.map(function(r) {
      return {
        name: r.name,
        growth: Number(r.growth),
        price: r.price,
        yieldPct: Number(r.yield_pct),
        tag: r.tag,
        forecast: Array.isArray(r.forecast) ? r.forecast : JSON.parse(r.forecast || "[]"),
        avg5yr: Number(r.avg5yr),
        outlook: r.outlook || "",
        catalyst: r.catalyst || null,
        signal: r.signal ? (Array.isArray(r.signal) ? r.signal : JSON.parse(r.signal)) : null,
        risk: r.risk || null,
        phase: r.phase || null,
        score: r.score || null,
        url: r.url || null,
      };
    });
  });
}
 
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
  var selectedName = props.selectedName, onSelect = props.onSelect, areas = props.areas || [];
  var mapId = "propiq-leaflet-map";
  var [activeArea, setActiveArea] = useState(null);
 
  useEffect(function() {
    var destroyed = false;
 
    function addLeafletCSS() {
      if (!document.getElementById("leaflet-css")) {
        var link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }
    }
 
    function initMap() {
      if (destroyed) return;
      if (!areas.length) return;
      var container = document.getElementById(mapId);
      if (!container) return;
      if (container._mapInstance) {
        container._mapInstance.remove();
        delete container._mapInstance;
      }
      var L = window.L;
      var map = L.map(container, {
        center: [38.705, -9.118],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "(c) OpenStreetMap (c) CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);
      areas.forEach(function(area) {
        var c = AREA_CENTROIDS[area.name];
        if (!c) return;
        var col = areaDotColor(area);
        var isSel = selectedName === area.name;
        var marker = L.circleMarker([c[0], c[1]], {
          radius: isSel ? 12 : 8,
          fillColor: col,
          fillOpacity: isSel ? 1 : 0.75,
          color: "#fff",
          weight: isSel ? 2.5 : 1.5,
        }).addTo(map);
        marker.bindPopup(
          "<div style='font-family:Jost,sans-serif;font-size:12px;padding:4px 2px;line-height:1.8;min-width:160px'>" +
          "<b style='font-size:13px'>" + area.name + "</b><br>" +
          "5yr avg: <b>+" + area.avg5yr + "%/yr</b><br>" +
          "Yield: <b>" + area.yieldPct + "%</b> &nbsp; Price: <b>EUR " + area.price + "/m2</b><br>" +
          (area.url ? "<a href='" + area.url + "' target='_blank' rel='noopener noreferrer' style='display:inline-block;margin-top:6px;color:#fff;background:#9e7c4a;padding:4px 10px;border-radius:3px;text-decoration:none;font-size:10px;font-weight:500;letter-spacing:0.08em'>VIEW ON IDEALISTA</a>" : "") +
          "</div>",
          { maxWidth: 220 }
        );
        marker.on("click", function() { onSelect(area); marker.openPopup(); });
      });
      container._mapInstance = map;
    }
 
    addLeafletCSS();
    if (window.L) {
      setTimeout(initMap, 50);
    } else {
      var script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = function() { setTimeout(initMap, 50); };
      document.body.appendChild(script);
    }
 
    return function() {
      destroyed = true;
      var container = document.getElementById(mapId);
      if (container && container._mapInstance) {
        container._mapInstance.remove();
        delete container._mapInstance;
        delete container._leaflet_id;
      }
    };
  }, [areas]); // eslint-disable-line react-hooks/exhaustive-deps
 
  useEffect(function() {
    var container = document.getElementById(mapId);
    if (!container || !container._mapInstance) return;
    var map = container._mapInstance;
    map.eachLayer(function(layer) {
      if (layer.setRadius) {
        var isSel = layer._tooltip && layer._tooltip._content && layer._tooltip._content.indexOf("<b>" + selectedName + "</b>") !== -1;
        layer.setRadius(isSel ? 12 : 8);
        layer.setStyle({ fillOpacity: isSel ? 1 : 0.75, weight: isSel ? 2.5 : 1.5 });
        if (isSel) {
          var latlng = layer.getLatLng();
          map.panTo(latlng, { animate: true });
        }
      }
    });
  }, [mapId, selectedName]); // eslint-disable-line react-hooks/exhaustive-deps
 
  return (
    <div>
      <div
        id={mapId}
        style={{ width: "100%", height: "280px", borderRadius: "3px", background: "#e8e0d4" }}
      />
      {activeArea && (
        <div style={{
          marginTop: "10px", padding: "12px 14px",
          background: "#f0e8dc", border: "1px solid #c8b9a8", borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#1c1815", marginBottom: "2px" }}>
              {activeArea.name}
            </div>
            <div style={{ fontSize: "9px", color: "#8a7f72", fontWeight: "300" }}>
              {"5yr avg +" + activeArea.avg5yr + "%/yr  |  Yield " + activeArea.yieldPct + "%  |  EUR " + activeArea.price + "/m2"}
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            {activeArea.url && (
              <a
                href={activeArea.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "9px", color: "#9e7c4a", textDecoration: "none",
                  border: "1px solid #9e7c4a", borderRadius: "2px",
                  padding: "5px 10px", fontWeight: "500", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontFamily: "Jost, sans-serif",
                  background: "white", display: "inline-block",
                }}
              >
                Idealista
              </a>
            )}
            <button
              onClick={function() { setActiveArea(null); }}
              style={{
                fontSize: "11px", color: "#8a7f72", background: "none",
                border: "1px solid #d8cfc6", borderRadius: "2px",
                padding: "5px 8px", cursor: "pointer", lineHeight: 1,
              }}
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default function ROICalculator() {
  var [areas, setAreas] = useState([]);
  var [areasLoading, setAreasLoading] = useState(true);
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
    fetchAreas().then(function(data) {
      setAreas(data);
      setAreasLoading(false);
    }).catch(function() { setAreasLoading(false); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
 
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
  var allAreas = areas;
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
          <div style={{ fontSize: "10px", color: C.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px" }}>PropIQ</div>
          <h1 style={{ fontSize: "32px", fontFamily: "Cormorant Garamond, serif", fontWeight: "300", color: C.text, margin: "0 0 6px", lineHeight: 1.15 }}>Investment Analyzer</h1>
          <p style={{ fontSize: "12px", color: C.textSub, margin: 0, fontWeight: "300" }}>Evaluate return on real estate</p>
        </div>
 
        {/* Row 1: Markets */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "0" }}>
          <button onClick={() => setTab("markets")} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", fontWeight: tab === "markets" ? "500" : "400", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "Jost, sans-serif", color: tab === "markets" ? C.accent : C.textSub, borderBottom: tab === "markets" ? "2px solid " + C.accent : "2px solid transparent", marginBottom: "-1px", transition: "all 0.2s" }}>Markets</button>
        </div>
 
        {/* Row 2: Deal tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "16px" }}>
          {["calculator","breakdown","projection","risk"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", fontWeight: tab === t ? "500" : "400", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "Jost, sans-serif", color: tab === t ? C.accent : C.textSub, borderBottom: tab === t ? "2px solid " + C.accent : "2px solid transparent", marginBottom: "-1px", transition: "all 0.2s" }}>{t}</button>
          ))}
        </div>
 
        {/* Gauge */}
        {tab !== "markets" && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <Gauge score={score} />
          </div>
        )}
 
        {/* - MARKETS TAB - */}
        {tab === "markets" && (
          <div style={{ marginBottom: "16px" }}>
 
            {/* Sub-tab nav */}
            <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: "16px" }}>
              {[["matrix","Matrix"],["map","Map"],["list","All Areas"]].map((item) => {
                var key = item[0], label = item[1];
                return (
                  <button key={key} onClick={() => setMarketSubTab(key)} style={{ flex: 1, padding: "9px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: "9px", fontWeight: marketSubTab === key ? "500" : "400", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "Jost, sans-serif", color: marketSubTab === key ? C.accent : C.textSub, borderBottom: marketSubTab === key ? "2px solid " + C.accent : "2px solid transparent", marginBottom: "-1px", transition: "all 0.2s" }}>
                    {label}
                  </button>
                );
              })}
            </div>
 
            {/* Matrix */}
            {marketSubTab === "matrix" && (
              <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "16px 18px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "3px" }}>Opportunity Matrix</div>
                    <div style={{ fontSize: "10px", color: C.textSub, fontWeight: "300" }}>Gross yield vs. 5yr growth forecast</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-end" }}>
                    {[["#4a7059","High growth"],["#9e7c4a","Mid growth"],["#7a8a9a","Low growth"],["#904a38","Slow"]].map((pair) => {
                      var col = pair[0], lbl = pair[1];
                      return (
                        <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: col }} />
                          <span style={{ fontSize: "8px", color: C.textMuted, fontWeight: "300" }}>{lbl}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
                {allAreas.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted, fontSize: "11px" }}>Loading...</div>
                )}
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
                  <text x={chartCx(CHART_X_MID)+6} y={CHART_PT+8} fontSize="7" fill="#4a7059" fontFamily="Jost, sans-serif" fontWeight="500">SWEET SPOT</text>
                  <text x={CHART_PL+4} y={CHART_PT+8} fontSize="7" fill="#7a8a9a" fontFamily="Jost, sans-serif">INCOME</text>
                  <text x={chartCx(CHART_X_MID)+6} y={CHART_PB-4} fontSize="7" fill="#9e7c4a" fontFamily="Jost, sans-serif">GROWTH</text>
                  <text x={CHART_PL+4} y={CHART_PB-4} fontSize="7" fill="#a09890" fontFamily="Jost, sans-serif">MATURE</text>
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
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>Tap any dot to apply</span>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>5yr avg %/yr</span>
                </div>
              </div>
            )}
 
            {/* Map */}
            {marketSubTab === "map" && (
              <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: "4px", padding: "16px 18px", marginBottom: "12px" }}>
                <div style={{ fontSize: "9px", color: C.textMuted, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "500", marginBottom: "3px" }}>Lisbon Region Map</div>
                <div style={{ fontSize: "10px", color: C.textSub, fontWeight: "300", marginBottom: "12px" }}>Tap a dot to select an area</div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                  {[["#4a7059",">=10%/yr"],["#9e7c4a","7-10%"],["#7a8a9a","5-7%"],["#904a38","<5%"]].map((pair) => {
                    var col = pair[0], lbl = pair[1];
                    return (
                      <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: col }} />
                        <span style={{ fontSize: "7.5px", color: C.textMuted, fontWeight: "300" }}>{lbl}</span>
                      </div>
                    );
                  })}
                </div>
                <LisbonMap areas={allAreas} selectedName={selectedArea && selectedArea.name} onSelect={a => { setSelectedArea(a); setAppreciation(parseFloat(a.avg5yr.toFixed(1))); }} />
                {selectedArea && selectedArea.url && (
                  <a href={selectedArea.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", padding: "10px 14px", background: C.accentLt, border: "1px solid " + C.borderHov, borderRadius: "3px", textDecoration: "none" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: C.text, marginBottom: "2px" }}>{selectedArea.name}</div>
                      <div style={{ fontSize: "9px", color: C.textSub, fontWeight: "300" }}>{"+" + selectedArea.avg5yr + "%/yr  |  Yield " + selectedArea.yieldPct + "%"}</div>
                    </div>
                    <span style={{ fontSize: "9px", color: C.accent, fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Jost, sans-serif" }}>Idealista &#8599;</span>
                  </a>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid " + C.divider }}>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>Dot colour = 5yr growth tier</span>
                  <span style={{ fontSize: "8.5px", color: C.textMuted, fontWeight: "300" }}>INE / Idealista 2025</span>
                </div>
              </div>
            )}
 
            {/* List */}
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
                      <div key={a.name} onClick={() => { setSelectedArea(a); setAppreciation(parseFloat(a.avg5yr.toFixed(1))); }} style={{ borderBottom: i < allAreas.length-1 ? "1px solid "+C.divider : "none", cursor: "pointer", padding: "14px 0", background: isSel ? C.accentLt : "transparent", borderLeft: isSel ? "2px solid "+C.accent : "2px solid transparent", paddingLeft: isSel ? "8px" : "0", transition: "all 0.2s" }}>
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
                        <div style={{ background: C.surfaceAlt, border: "1px solid "+C.border, borderRadius: "3px", padding: "8px 10px", marginBottom: "8px" }}>
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
                          <div style={{ marginBottom: "8px" }}>
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
                        {a.url && (
                          <a href={a.url} target="_blank" rel="noopener noreferrer" onClick={function(e){ e.stopPropagation(); }} style={{ display: "block", textAlign: "center", padding: "8px", border: "1px solid " + C.borderHov, borderRadius: "3px", textDecoration: "none", background: C.accentLt, fontSize: "9px", color: C.accent, fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Jost, sans-serif" }}>
                            View listings on Idealista &#8599;
                          </a>
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
                  <p style={{ fontSize: "9px", color: C.textMuted, margin: 0, lineHeight: 1.6, fontWeight: "300" }}>Data: INE, Idealista 2025. Not financial advice.</p>
                </div>
              </div>
            )}
          </div>
        )}
 
        {/* - CALCULATOR TAB - */}
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
                  <span style={{ fontSize: "9px", color: C.accent, fontWeight: "500" }}>{"Using " + selectedArea.name + " 5yr avg (+" + selectedArea.avg5yr + "%/yr)"}</span>
                  <button onClick={() => { setSelectedArea(null); setAppreciation(3); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: "12px", padding: "0 0 0 8px" }}>x</button>
                </div>
              )}
            </div>
          </div>
        )}
 
        {/* - BREAKDOWN TAB - */}
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
 
        {/* - PROJECTION TAB - */}
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
 
        {/* - RISK TAB - */}
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
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: overallRisk === level ? (level === "High" ? C.badLt : level === "Moderate" ? C.accentLt : C.goodLt) : C.surfaceAlt, border: "1px solid " + (overallRisk === level ? (level === "High" ? C.bad : level === "Moderate" ? C.accent : C.good) : C.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "500", color: overallRisk === level ? (level === "High" ? C.bad : level === "Moderate" ? C.accent : C.good) : C.textMuted, transition: "all 0.3s" }}>{level[0]}</div>
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
        <button style={{ width: "100%", padding: "16px", background: C.text, border: "none", borderRadius: "4px", fontSize: "10px", fontWeight: "500", color: C.bg, cursor: "pointer", fontFamily: "Jost, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", transition: "background 0.2s" }}
          onMouseEnter={function(e){ e.target.style.background = C.accentDark; }}
          onMouseLeave={function(e){ e.target.style.background = C.text; }}>
          Save This Analysis
        </button>
        <p style={{ textAlign: "center", fontSize: "10px", color: C.textMuted, marginTop: "16px", fontWeight: "300", letterSpacing: "0.02em" }}>
          For informational purposes only. Consult a financial advisor.
        </p>
 
      </div>
    </div>
  );
}