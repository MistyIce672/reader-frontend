import { API_URL } from "../api";
import { authService } from "./auth.service";

export class BookService {
  async getAllUserBooks() {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/books/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async getBookDetails(bookId) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/books/${bookId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async getPage(bookId, page) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/books/${bookId}/${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.json();
  }
  async createBook(bookData) {
    const token = authService.getUser();
    const res = await fetch(`${API_URL}/api/books/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(bookData),
    });
    return res.json();
  }
}

export const bookService = new BookService();
