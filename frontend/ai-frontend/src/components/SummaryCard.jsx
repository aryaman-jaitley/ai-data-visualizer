export default function SummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="card highlight">
      <h3>Dataset Summary</h3>
      <p>{summary}</p>
    </div>
  );
}
