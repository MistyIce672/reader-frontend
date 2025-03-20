import { API_URL } from "../api";
import { authService } from "./auth.service";

export class TranslateService {
  async getLanguages() {
    const token = authService.getUser();
    try {
      const res = await fetch(`${API_URL}/api/translate/languages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return res.json();
    } catch (error) {
      console.error("Error fetching languages:", error);
      return { error: "Failed to fetch languages" };
    }
  }

}

export const translateService = new TranslateService();
