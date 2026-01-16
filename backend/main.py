from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import json
import os
import re

from google import genai

# -------------------------------
# APP INIT
# -------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# GENAI CLIENT (NEW SDK)
# -------------------------------
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-3-flash-preview"

# -------------------------------
# GLOBAL STATE
# -------------------------------
dataset = {}
dataset_summary = ""
auto_charts = []

# -------------------------------
# HELPERS
# -------------------------------

def dataframe_schema(df: pd.DataFrame):
    return [
        {
            "name": col,
            "type": "numeric" if np.issubdtype(df[col].dtype, np.number) else "categorical"
        }
        for col in df.columns
    ]


def extract_json(text: str):
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("Gemini response did not contain valid JSON")
    return json.loads(match.group())


def ask_gemini_for_analysis(schema):
    prompt = f"""
You are a professional data analyst.

Dataset schema:
{schema}

Tasks:
1. Explain clearly what this dataset represents (2–3 sentences).
2. Suggest 3–5 meaningful visualizations.

For each visualization return:
- chart_type (line, bar, scatter, histogram, box, heatmap)
- x
- y (or null)
- aggregation (mean, sum, count or null)
- description

Return ONLY JSON in this format:

{{
  "summary": "...",
  "charts": [
    {{
      "chart_type": "...",
      "x": "...",
      "y": "...",
      "aggregation": null,
      "description": "..."
    }}
  ]
}}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return extract_json(response.text)


def build_plotly_chart(df, spec):
    chart_type = spec["chart_type"]
    x = spec["x"]
    y = spec.get("y")
    agg = spec.get("aggregation")

    data_df = df.copy()

    if agg and y:
        data_df = data_df.groupby(x)[y].agg(agg).reset_index()

    if chart_type == "line":
        return {
            "data": [{
                "x": data_df[x].tolist(),
                "y": data_df[y].tolist(),
                "type": "scatter",
                "mode": "lines"
            }],
            "layout": {"title": spec["description"]}
        }

    if chart_type == "bar":
        return {
            "data": [{
                "x": data_df[x].astype(str).tolist(),
                "y": data_df[y].tolist(),
                "type": "bar"
            }],
            "layout": {"title": spec["description"]}
        }

    if chart_type == "scatter":
        return {
            "data": [{
                "x": data_df[x].tolist(),
                "y": data_df[y].tolist(),
                "type": "scatter",
                "mode": "markers"
            }],
            "layout": {"title": spec["description"]}
        }

    if chart_type == "histogram":
        return {
            "data": [{
                "x": df[x].tolist(),
                "type": "histogram"
            }],
            "layout": {"title": spec["description"]}
        }

    if chart_type == "box":
        return {
            "data": [{
                "x": df[x].tolist(),
                "y": df[y].tolist(),
                "type": "box"
            }],
            "layout": {"title": spec["description"]}
        }

    return None

# -------------------------------
# API ENDPOINTS
# -------------------------------

@app.post("/upload")
async def upload(file: UploadFile):
    global dataset, dataset_summary, auto_charts

    try:
        df = pd.read_csv(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")

    dataset["df"] = df

    try:
        llm_response = ask_gemini_for_analysis(dataframe_schema(df))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    dataset_summary = llm_response["summary"]
    auto_charts = []

    for spec in llm_response["charts"]:
        chart = build_plotly_chart(df, spec)
        if chart:
            auto_charts.append({
                "spec": spec,
                "chart": chart
            })

    return {
        "summary": dataset_summary,
        "charts": auto_charts
    }


@app.post("/query")
async def query(payload: dict):
    question = payload.get("query", "")

    if not dataset_summary:
        raise HTTPException(status_code=400, detail="No dataset uploaded")

    prompt = f"""
Dataset summary:
{dataset_summary}

User question:
{question}

Answer clearly using the dataset context.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return {
        "answer": response.text.strip()
    }


@app.get("/")
def root():
    return {"status": "AI Data Visualization Agent running"}
