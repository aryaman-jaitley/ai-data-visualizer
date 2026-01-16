import Plot from "react-plotly.js";

export default function ChartView({ chart }) {
  if (!chart) return null;

  return (
    <div className="card">
      <Plot
        data={chart.data}
        layout={{
          ...chart.layout,
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
