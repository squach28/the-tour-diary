import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    throw e;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      try {
        await refreshToken();
        const response = await api(originalRequest);
        return response;
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
