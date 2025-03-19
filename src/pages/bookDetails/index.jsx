import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "../../services/book.service";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookData = await bookService.getBookDetails(bookId);
        setBook(bookData.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load book details");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleReadClick = () => {
    navigate(`/books/${bookId}/read/${book.pageNumber}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  if (!book) {
    return <div className="text-center p-4">Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{book.title}</h1>{" "}
        {/* Changed from book.name to book.title */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <label className="w-40 font-medium text-gray-600">
              Original Language:
            </label>
            <span className="text-gray-800">{book.originalLanguage}</span>
          </div>

          <div className="flex items-center">
            <label className="w-40 font-medium text-gray-600">
              Translated Language:
            </label>
            <span className="text-gray-800">{book.translatedLanguage}</span>
          </div>

          <div className="flex items-center">
            <label className="w-40 font-medium text-gray-600">
              Current Page:
            </label>
            <span className="text-gray-800">{book.pageNumber}</span>{" "}
            {/* Changed from book.currentPage to book.pageNumber */}
          </div>

          {/* You might want to add file information */}
          <div className="flex items-center">
            <label className="w-40 font-medium text-gray-600">File Name:</label>
            <span className="text-gray-800">{book.file.name}</span>
          </div>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleReadClick}
        >
          Read
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
