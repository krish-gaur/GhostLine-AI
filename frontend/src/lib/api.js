import axios from "axios";

// ✅ Vite env
export const DETECTION_API_URL =
  import.meta.env.VITE_DETECTION_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: DETECTION_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

/**
 * POST /analyze
 */
export const analyzePosts = async (posts) => {
  const { data } = await api.post("/analyze", {
    posts: posts,
  });
  return data;
};