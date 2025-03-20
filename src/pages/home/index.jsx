import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookService } from "../../services/book.service";
import { authService } from "../../services/auth.service"; // Add this import

function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllUserBooks();
      setBooks(data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books");
      setLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  // Add logout handler
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add logout button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-left mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Reading Library
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
            Continue your language learning journey with your personal
            collection of books.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Add Book Button */}
          <Link
            to="/add-book"
            className="aspect-[1/1.4142] border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer bg-white"
          >
            <div className="text-center">
              <div className="text-4xl text-indigo-400 mb-2">+</div>
              <div className="text-indigo-600 font-medium">Add New Book</div>
            </div>
          </Link>

          {/* Book Cards */}
          {books.map((book) => (
            <div
              key={book._id}
              onClick={() => handleBookClick(book._id)}
              className="aspect-[1/1.4142] border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer bg-white overflow-hidden hover:border-indigo-500"
            >
              <div className="h-full p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-indigo-600 mb-2 font-medium">
                  {book.author}
                </p>
                {book.description && (
                  <p className="text-gray-500 text-sm flex-grow line-clamp-4">
                    {book.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-xl text-gray-600 mb-4">
              Your library is empty. Start adding some books!
            </p>
            <Link
              to="/add-book"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Your First Book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
