import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookService } from "../../services/book.service";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Add Book Button */}

        {/* Book Cards */}
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => handleBookClick(book._id)}
            className="aspect-[1/1.4142] border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white overflow-hidden"
          >
            <div className="h-full p-4 flex flex-col">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-2">{book.author}</p>
              {book.description && (
                <p className="text-gray-500 text-sm flex-grow line-clamp-4">
                  {book.description}
                </p>
              )}
            </div>
          </div>
        ))}
        <Link
          to="/add-book"
          className="aspect-[1/1.4142] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <div className="text-center">
            <div className="text-4xl text-gray-400 mb-2">+</div>
            <div className="text-gray-600">Add New Book</div>
          </div>
        </Link>
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No books found. Start adding some!
        </p>
      )}
    </div>
  );
}

export default Home;
