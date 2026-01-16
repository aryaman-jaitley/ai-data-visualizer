import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChartView from "./components/ChartView";
import { queryData } from "./services/api";
import "./app.css";

export default function App() {
  const [summary, setSummary] = useState("");
  const [charts, setCharts] = useState([]);
  const [activeChart, setActiveChart] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleUpload = (data) => {
    setSummary(data.summary);
    setCharts(data.charts);
    setActiveChart(null);
    setAnswer("");
  };

  const askQuestion = async () => {
    if (!question) return;
    const res = await queryData(question);
    setAnswer(res.data.answer);
  };

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header glass">
        <div>
          <h1 className="logo">AI Data Analyst</h1>
          <p className="subtitle">Automatic dataset understanding & visualization</p>
        </div>
      </header>

      <main className="content">
        {/* Upload */}
        <section className="card glass">
          <h2>Upload Dataset</h2>
          <FileUpload onUpload={handleUpload} />
        </section>

        {/* Summary */}
        {summary && (
          <section className="card hero glass fade-in">
            <h2>Dataset Overview</h2>
            <p>{summary}</p>
          </section>
        )}

        {/* Chart Suggestions */}
        {charts.length > 0 && (
          <section className="card glass fade-in">
            <h2>Suggested Visualizations</h2>

            <select
              className="dropdown"
              onChange={(e) => setActiveChart(charts[e.target.value])}
            >
              <option value="">Select a visualization</option>
              {charts.map((c, i) => (
                <option key={i} value={i}>
                  {c.spec.chart_type.toUpperCase()} — {c.spec.description}
                </option>
              ))}
            </select>
          </section>
        )}

        {/* Chart */}
        {activeChart && (
          <section className="card glass fade-in">
            <ChartView chart={activeChart.chart} />
          </section>
        )}

        {/* Question Panel */}
        {summary && (
          <section className="card glass fade-in">
            <h2>Ask a Question</h2>
            <input
              className="text-input"
              placeholder="Why does this trend exist?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button className="btn-primary" onClick={askQuestion}>
              Analyze
            </button>

            {answer && <p className="answer">{answer}</p>}
          </section>
        )}
      </main>

      <footer className="footer">
        Built with LLMs • Pandas • Plotly
      </footer>
    </div>
  );
}
