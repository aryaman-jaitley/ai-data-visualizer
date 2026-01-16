export default function ChartSelector({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="card">
      <h3>Suggested Visualizations</h3>

      <select onChange={(e) => onSelect(suggestions[e.target.value])}>
        <option value="">Select a chart</option>
        {suggestions.map((s, idx) => (
          <option key={idx} value={idx}>
            {s.chart_type.toUpperCase()} – {s.description}
          </option>
        ))}
      </select>
    </div>
  );
}
