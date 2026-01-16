export default function InsightPanel({ insight }) {
  if (!insight) return null;

  return (
    <div className="card highlight">
      <h3>AI Insight</h3>
      <p>{insight}</p>
    </div>
  );
}
