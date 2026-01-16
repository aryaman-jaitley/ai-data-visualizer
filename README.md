# AI-Powered Data Visualization Agent

An intelligent web application that automatically analyzes uploaded datasets, explains what the data represents, and suggests meaningful visualizations using Large Language Models (LLMs).

## 🚀 Features
- CSV upload & automatic dataset understanding
- LLM-generated dataset summary
- Intelligent chart suggestions
- Interactive Plotly visualizations
- Natural language question answering
- Clean, modern React frontend

## 🧠 Tech Stack
**Frontend**
- React (Vite)
- Plotly.js
- CSS (Glassmorphism, pastel UI)

**Backend**
- FastAPI
- Pandas, NumPy
- Google Gemini (GenAI SDK)

## 🛠️ Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
set GEMINI_API_KEY=your_api_key
uvicorn main:app --reload
