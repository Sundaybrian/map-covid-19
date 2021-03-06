import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";

const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const showStats = ({ object, x, y }) => {
  const el = document.getElementById("tooltip");
  if (object) {
    const {
      cases,
      deaths,
      total_recovered,
      serious_critical,
      active_cases,
      new_cases,
      country_name,
      flag
    } = object;
    const dN = deaths
      ? `<tr><td>⚰️ Deaths</td><td>${formatNumber(deaths)}</td></tr>`
      : "";
    const sC = serious_critical
      ? `<tr> <td>🚑 Serious</td><td>${formatNumber(
          serious_critical
        )}</td> </tr>`
      : "";
    const aC = active_cases
      ? `<tr><td>🛌 Active</td><td>${formatNumber(active_cases)}</td></tr>`
      : "";
    const tR = total_recovered
      ? `<tr><td>🚶 Recovered</td><td>${formatNumber(
          total_recovered
        )}</td></tr>`
      : "";
    const nC = new_cases
      ? `<tr><td>⚡ New Cases</td><td>${formatNumber(new_cases)}</td></tr>`
      : "";
    el.innerHTML = `
        <h3><span style="font-size: 200%">${flag}</span><span>&nbsp; ${country_name.toUpperCase()}</span></h3>
        <table>${nC}</table>
        <table> ${dN}  ${sC} ${aC} ${tR} </table>
        <table>
          <tr><td>🦠 Cases</td><td>${formatNumber(cases)}</td></tr>
        </table>
      `;
    el.style.display = "block";
    el.style.opacity = 0.7;
    el.style.left = x + "px";
    el.style.top = y + "px";
  } else {
    el.style.opacity = 0.0;
  }
};

export const scatterplot = source_data => {
  return new ScatterplotLayer({
    id: "scatter",
    data: source_data,
    opacity: 0.7,
    filled: true,
    radiusMinPixels: 5,
    radiusMaxPixels: 100,
    radiusScale: 8,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => (d.deaths < 1 ? [255, 255, 0, 100] : [255, 0, 0, 100]),
    getRadius: d => (d.active_cases < 50 ? 5 : d.active_cases + d.deaths * 10),
    getLineWidth: 4,
    getLineColor: "#000000",
    pickable: true,
    onHover: showStats,
    onClick: showStats
  });
};

export const heatmap = source_data => {
  return new HeatmapLayer({
    id: "heat",
    data: source_data || [],
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.cases + d.deaths * 100 + d.new_cases * 10,
    radiusPixels: 120
  });
};
