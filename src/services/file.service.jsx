import { API_URL } from "../api";

export class FileService {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/files/`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }
}

export const fileService = new FileService();
