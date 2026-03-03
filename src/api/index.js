export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3111";

export async function authFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "user_";
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
    throw new Error("Session expired");
  }
  return res;
}
