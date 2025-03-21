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

  const handleKnownWordsClick = () => {
    navigate(
      `/known-words/${book.originalLanguage}/${book.translatedLanguage}`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-indigo-600 text-xl font-medium">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-red-600 text-xl font-medium">{error}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-gray-600 text-xl font-medium">Book not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">{book.title}</span>
                </h1>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Book Details Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Book Details
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <span className="text-gray-500 font-medium w-48">
                    Original Language:
                  </span>
                  <span className="text-gray-900">{book.originalLanguage}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 font-medium w-48">
                    Translated Language:
                  </span>
                  <span className="text-gray-900">
                    {book.translatedLanguage}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 font-medium w-48">
                    Current Page:
                  </span>
                  <span className="text-gray-900">{book.pageNumber}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 font-medium w-48">
                    File Name:
                  </span>
                  <span className="text-gray-900">{book.file.name}</span>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleKnownWordsClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    See Known Words
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700 mt-12">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start reading?</span>
          </h2>
          <button
            onClick={handleReadClick}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Start Reading
          </button>
        </div>
      </section>
    </div>
  );
};

export default BookDetails;
