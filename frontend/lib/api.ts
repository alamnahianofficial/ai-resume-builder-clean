import axios from "axios";

export const api = axios.create({
  baseURL: "https://ai-resume-backend-ev83.onrender.com",
});
