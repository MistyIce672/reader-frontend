import { API_URL } from "../api";
import { authService } from "./auth.service";

export class WordService {
  async addWord(wordData) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/words`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        originalWord: wordData.originalWord,
        translatedWord: wordData.translatedWord,
        originalLanguage: wordData.originalLanguage,
        translatedLanguage: wordData.translatedLanguage,
        translate: wordData.translate || true,
      }),
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
  async getWordsByLanguages(originalLanguage, translatedLanguage) {
    const token = authService.getUser();
    const res = await fetch(
      `${API_URL}/api/words/${originalLanguage}/${translatedLanguage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    );
    return res.json();
  }
  async deleteWord(wordId) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/words/${wordId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    return res.json();
  }

  async updateTranslate(wordId, translate) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/words/${wordId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        translate: translate,
      }),
    });
    return res.json();
  }
}

export const wordService = new WordService();
