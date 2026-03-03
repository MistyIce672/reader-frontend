import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicBookService } from "../../services/publicBook.service";
import { fileService } from "../../services/file.service";
import { translateService } from "../../services/translate.service";
import { authService } from "../../services/auth.service";

const Admin = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [translatedLanguage, setTranslatedLanguage] = useState("");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [newWords, setNewWords] = useState(2);
  const [publicBooks, setPublicBooks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await authService.getMe();
      if (!user || user.role !== "admin") {
        navigate("/home");
        return;
      }
      setIsAdmin(true);
      await Promise.all([fetchLanguages(), fetchPublicBooks()]);
    } catch (err) {
      navigate("/home");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await translateService.getLanguages();
      if (response.languages) {
        setLanguages(response.languages);
      }
    } catch (err) {
      setError("Failed to fetch languages");
    }
  };

  const fetchPublicBooks = async () => {
    try {
      const response = await publicBookService.getAllPublicBooks();
      if (response.data) {
        setPublicBooks(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch public books");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fileResponse = await fileService.uploadFile(file);
      if (fileResponse.error) {
        throw new Error(fileResponse.error);
      }

      const bookData = {
        title,
        description,
        file: fileResponse._id,
        originalLanguage,
        translatedLanguage,
        newWords,
      };

      const response = await publicBookService.createPublicBook(bookData);
      if (response.error) {
        throw new Error(response.error);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setFileName("");
      setOriginalLanguage("");
      setTranslatedLanguage("");
      setNewWords(2);
      await fetchPublicBooks();
    } catch (err) {
      setError(err.message || "Failed to create public book");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure you want to delete this public book?")) return;
    try {
      await publicBookService.deletePublicBook(bookId);
      await fetchPublicBooks();
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Admin Panel
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Manage Public Books
            </p>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
          >
            Back to Library
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          </div>
        )}

        {/* Create Public Book Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Add New Public Book
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of the book"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  {fileName && (
                    <p className="text-sm text-indigo-600">{fileName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Words Per Page
              </label>
              <input
                type="number"
                value={newWords}
                onChange={(e) =>
                  setNewWords(Math.max(1, parseInt(e.target.value) || 1))
                }
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Language
                </label>
                <select
                  value={originalLanguage}
                  onChange={(e) => setOriginalLanguage(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Language</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Translated Language
                </label>
                <select
                  value={translatedLanguage}
                  onChange={(e) => setTranslatedLanguage(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Language</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Public Book"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Public Books */}
        {publicBooks.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Existing Public Books
            </h3>
            <div className="space-y-4">
              {publicBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {book.title}
                    </h4>
                    {book.description && (
                      <p className="text-gray-500 text-sm mt-1">
                        {book.description}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {book.originalLanguage} → {book.translatedLanguage}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
