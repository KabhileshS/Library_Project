import { useState, useEffect } from "react";
import axios from "axios";

const Request = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3002/books");
        setBooks(response.data.books);
      } catch (error) {
        setError("Error fetching books");
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const requestBook = async (bookId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/request",
        { bookId },
        { headers: { "x-access-token": token } }
      );
      
      if (response.status === 201) {
        alert("Book requested successfully!");
        setBooks(books.map(book => book._id === bookId ? { ...book, available: false } : book));
      } else {
        alert("Failed to request book.");
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Error requesting book.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>Request to Borrow Books</h2>
      
      <input
        type="text"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> - {book.author}{" "}
              {book.available ? "(Available)" : "(Not Available)"}
              {book.available && (
                <button onClick={() => requestBook(book.id)}>Request</button>
              )}
            </li>
          ))
        ) : (
          <li>No books found</li>
        )}
      </ul>
    </div>
  );
};

export default Request;
