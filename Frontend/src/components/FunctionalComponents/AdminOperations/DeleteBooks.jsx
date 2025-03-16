import { useState, useEffect } from "react";
import axios from "axios";

const DeleteBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(""); // Search input state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://library-project-2bbk.onrender.com/books");
        setBooks(response.data.books);
      } catch (error) {
        setError("Error fetching books.");
        console.error("Fetch error:", error);
      }
    };

    fetchBooks();
  }, []);

  // Function to delete a book by title
  const handleDelete = async (title) => {
    try {
      const response = await axios.delete("https://library-project-2bbk.onrender.com/delete", {
        data: { title },
      });

      if (response.data.isDeleted) {
        setSuccess(response.data.message);
        setError("");

        // Remove the deleted book from the list
        setBooks(books.filter((book) => book.title !== title));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error deleting book.");
      console.error("Delete error:", error);
    }
  };

  // Filter books based on search query
  const filteredBooks = books
    .filter((book) => book.title.toLowerCase().includes(search.toLowerCase()))
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
      padding: "5px 10px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#a71d2a",
    },
    error: {
      color: "red",
      textAlign: "center",
    },
    success: {
      color: "green",
      textAlign: "center",
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
      <h1 style={styles.heading}>Delete Books</h1>

      {/* Error and Success Messages */}
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* Book List */}
      <ul style={styles.bookList}>
        {filteredBooks.length === 0 ? (
          <p>No books found</p>
        ) : (
          filteredBooks.map((book) => (
            <li key={book.id} style={styles.bookItem}>
              {book.title} - {book.author}
              <button
                onClick={() => handleDelete(book.title)}
                style={styles.button}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DeleteBooks;
