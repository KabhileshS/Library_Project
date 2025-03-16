import { useState, useEffect } from "react";
import axios from "axios";

const Returns = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(null); // Track loading state for a specific book

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3002/search");
        setBooks(response.data.books);
      } catch (error) {
        setError("Error fetching books");
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  // Function to mark a book as returned
  const handleReturn = async (id) => {
    setReturning(id); // Show loading state for the book being returned
    try {
      const response = await axios.post("http://localhost:3002/return", { bookId: id });

      // Update book list with returned status
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === id ? { ...book, availability: "Available" } : book
        )
      );
    } catch (error) {
      console.error("Return failed:", error);
      alert("Failed to return book. Please try again.");
    }
    setReturning(null); // Remove loading state
  };

  // Filter books based on search query
  const filteredBooks = books
    .filter(
      (book) =>
        book.availability !== "Available" && // Only show non-returned books
        (book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title

  // Inline styles
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
      boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    button: {
      padding: "8px 12px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    buttonDisabled: {
      backgroundColor: "#6c757d",
      cursor: "not-allowed",
    },
    error: {
      color: "red",
      textAlign: "center",
    },
    loading: {
      textAlign: "center",
      fontStyle: "italic",
    },
    bookList: {
      listStyleType: "none",
      padding: "0",
    },
    bookItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px",
      borderBottom: "1px solid #ddd",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Update Returned Books</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {loading && <p style={styles.loading}>Loading books...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {filteredBooks.length === 0 ? (
        <p>No books found or all books have been returned.</p>
      ) : (
        <ul style={styles.bookList}>
          {filteredBooks.map((book) => (
            <li key={book._id} style={styles.bookItem}>
              <b>{book.title}</b> by {book.author} -{" "}
              {book.availability === "Available" ? (
                <strong>Returned ✅</strong>
              ) : (
                <button
                  onClick={() => handleReturn(book._id)}
                  disabled={returning === book._id}
                  style={returning === book._id ? styles.buttonDisabled : styles.button}
                >
                  {returning === book._id ? "Returning..." : "Mark as Returned ✅"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Returns;
