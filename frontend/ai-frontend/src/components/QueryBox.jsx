import { useState } from "react";

export default function QueryBox({ onAsk }) {
  const [query, setQuery] = useState("");

  return (
    <div className="card">
      <h3>Ask a Question</h3>
      <input
        placeholder="e.g. Explain the trend or compare categories"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => onAsk(query)}>Analyze</button>
    </div>
  );
}
