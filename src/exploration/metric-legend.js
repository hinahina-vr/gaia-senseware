// DOM counterpart of the map's CO2 quantitative legend. Values stay numeric;
// formatting, source scope and units belong to the exhibit that owns the data.
const instances = new WeakMap();
export const metricLegendProgress = (value, minimum, maximum) =>
  Number.isFinite(value) && Number.isFinite(minimum) && Number.isFinite(maximum) && maximum > minimum
    ? Math.max(0, Math.min(1, (value - minimum) / (maximum - minimum))) : null;

export function createMetricLegend({ className = "", label = "観測値と色の目盛り" } = {}) {
  const element = document.createElement("section");
  element.className = `gaia-metric-legend ${className}`.trim();
  element.setAttribute("aria-label", label);
  element.innerHTML = `
    <header class="gaia-metric-legend-heading"><span data-metric-scope></span></header>
    <div class="gaia-metric-legend-current"><span data-metric-title></span><strong data-metric-current>—</strong></div>
    <div class="gaia-metric-legend-context"><span data-metric-period></span></div>
    <div class="gaia-metric-legend-track" aria-hidden="true"><i data-metric-marker hidden></i></div>
    <div class="gaia-metric-legend-range"><span data-metric-minimum></span><span data-metric-maximum></span></div>`;
  const fields = Object.fromEntries(["title", "scope", "period", "current", "marker", "minimum", "maximum"].map(name => [name, element.querySelector(`[data-metric-${name}]`)]));
  const row = element.querySelector(".gaia-metric-legend-current");
  const measure = document.createElement("canvas").getContext("2d");
  const fit = () => {
    if (!row.clientWidth || !measure) return;
    const style = getComputedStyle(row);
    const family = style.fontFamily;
    const preferred = parseFloat(style.getPropertyValue("--metric-preferred-size")) || 21;
    measure.font = `400 ${preferred}px ${family}`;
    const textWidth = measure.measureText(fields.current.textContent).width;
    row.style.setProperty("--metric-current-size", `${Math.min(preferred, Math.max(16, preferred * row.clientWidth / Math.max(1, textWidth))).toFixed(2)}px`);
  };
  const observer = new ResizeObserver(fit);
  observer.observe(row);
  document.fonts?.ready.then(fit);
  instances.set(element, { fields, fit, observer });
  return element;
}

export function updateMetricLegend(element, { title, scope = "", period = "", current = "—", value = null,
  minimum = null, maximum = null, minimumLabel = "—", maximumLabel = "—", gradient = "", description = "" }) {
  const instance = instances.get(element);
  if (!instance) return;
  const { fields, fit } = instance;
  for (const [name, content] of Object.entries({ title, scope, period, current, minimum: minimumLabel, maximum: maximumLabel })) {
    fields[name].textContent = String(content ?? "");
  }
  const progress = metricLegendProgress(value, minimum, maximum);
  fields.marker.hidden = progress === null;
  fields.marker.style.left = `${(progress ?? 0) * 100}%`;
  if (gradient) element.style.setProperty("--metric-gradient", gradient);
  element.dataset.metricValue = Number.isFinite(value) ? String(value) : "";
  element.dataset.metricMinimum = Number.isFinite(minimum) ? String(minimum) : "";
  element.dataset.metricMaximum = Number.isFinite(maximum) ? String(maximum) : "";
  element.dataset.metricProgress = progress === null ? "" : String(progress);
  element.title = description;
  element.setAttribute("aria-label", [title, scope, period, current, `${minimumLabel}〜${maximumLabel}`, description].filter(Boolean).join("、"));
  fit();
  requestAnimationFrame(() => globalThis.GaiaMapLegendDrag?.syncObservationPanels?.());
}
