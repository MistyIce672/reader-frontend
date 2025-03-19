import { API_URL } from "../api";
import { authService } from "./auth.service";

export class WordService {
  async addWord(words, lng) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/words/${lng}`, {
      method: "POST", // Add POST method
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ words }), // Add word in request body
    });
    return res.json();
  }

  async translate(word, lng, transLng) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/words/translation`, {
      method: "POST", // Add the POST method
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        // Add the request body
        word: word,
        originalLanguage: lng,
        translatedLanguage: transLng,
      }),
    });
    return res.json();
  }
}

export const wordService = new WordService();
