import { API_URL, authFetch } from "../api";
import { authService } from "./auth.service";

export class PublicBookService {
  async getAllPublicBooks() {
    const token = authService.getUser();
    const res = await authFetch(`${API_URL}/api/public-books/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async getPublicBookDetails(bookId) {
    const token = authService.getUser();
    const res = await authFetch(`${API_URL}/api/public-books/${bookId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async getPage(bookId, page) {
    const token = authService.getUser();
    const res = await authFetch(`${API_URL}/api/public-books/${bookId}/${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async createPublicBook(bookData) {
    const token = authService.getUser();
    const res = await authFetch(`${API_URL}/api/public-books/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(bookData),
    });
    return res.json();
  }
  async deletePublicBook(bookId) {
    const token = authService.getUser();
    const res = await authFetch(`${API_URL}/api/public-books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async updatePublicBook(bookId, updateData) {
    const token = authService.getUser();
    const res = await authFetch(`${API_URL}/api/public-books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(updateData),
    });
    return res.json();
  }
}

export const publicBookService = new PublicBookService();
