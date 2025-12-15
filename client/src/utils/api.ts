import axios from "axios";
import URL from "./config";

const api = axios.create({
  baseURL: URL,
  responseType: "json",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
