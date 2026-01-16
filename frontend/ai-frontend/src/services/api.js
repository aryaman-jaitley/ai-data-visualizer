import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadFile = (formData) =>
  API.post("/upload", formData);

export const queryData = (query) =>
  API.post("/query", { query });
