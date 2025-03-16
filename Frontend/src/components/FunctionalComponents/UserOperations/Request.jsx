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
        const response = await axios.get("https://library-project-2bbk.onrender.com/books");
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
    console.log("Requesting book with ID:", bookId); // ✅ Debugging Log

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "https://library-project-2bbk.onrender.com/request",
        { bookId },
        { headers: { "x-access-token": token } }
      );

      alert(response.data.message);
      setBooks(books.map(book => book._id === bookId ? { ...book, available: false } : book));
    } catch (error) {
      console.error("Request error:", error);
      if (error.response) {
        alert(error.response.data.error); // ✅ Show proper error message
      } else {
        alert("Error requesting book.");
      }
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title;

  return (
    <div className="request-container">
      <h2>Request to Borrow Books</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="loading">Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book.id} className="book-item">
              <strong>{book.title}</strong> - {book.author} {" "}
              {book.available ? <span className="available">(Available)</span> : <span className="not-available">(Not Available)</span>}
              {book.available && (
                <button className="request-button" onClick={() => requestBook(book.id)}>Request</button>
              )}
            </li>
          ))
        ) : (
          <li className="no-books">No books found</li>
        )}
      </ul>

      <style>{`
        .request-container {
          padding: 20px;
          max-width: 600px;
          margin: auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .search-input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .loading {
          color: blue;
          font-size: 14px;
        }
        .error {
          color: red;
          font-size: 14px;
        }
        .book-list {
          list-style: none;
          padding: 0;
        }
        .book-item {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .available {
          color: green;
        }
        .not-available {
          color: red;
        }
        .request-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 5px;
        }
        .request-button:hover {
          background-color: #0056b3;
        }
        .no-books {
          font-style: italic;
          color: gray;
        }
      `}</style>
    </div>
  );
};

export default Request;
