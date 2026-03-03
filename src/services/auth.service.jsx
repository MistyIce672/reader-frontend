import { API_URL, authFetch } from "../api";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "user_";

export class AuthService {
  async login(email, password) {
    let data = JSON.stringify({ email: email, password: password });
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      return true;
    } else {
      return response.error;
    }
  }
  async signup(email, password, username) {
    let data = JSON.stringify({
      email: email,
      password: password,
      username: username,
    });

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: "An error occurred during signup" };
    }
  }
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  saveUser(user = undefined) {
    if (!user) return;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
  }

  setbotToken(user = undefined) {
    if (!user) return;
    localStorage.setItem(TOKEN_KEY, user);
  }

  getUser() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  async getMe() {
    const token = this.getUser();
    if (!token) return null;
    try {
      const res = await authFetch(`${API_URL}/api/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return res.json();
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
