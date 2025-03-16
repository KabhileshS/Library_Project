import { useState, useEffect } from "react";
import axios from "axios";

const AddBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // For search filtering
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [search, setSearch] = useState(""); // Search input state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://library-project-2bbk.onrender.com/books");
        const sortedBooks = response.data.books.sort((a, b) =>
          a.title.localeCompare(b.title)
        ); // Sort books alphabetically
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks); // Initialize filtered list with sorted books
      } catch (error) {
        setError("Error fetching books.");
        console.error("Fetch error:", error);
      }
    };

    fetchBooks();
  }, []);

  // Function to add a new book
  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!title || !author) {
      setError("Both title and author are required.");
      return;
    }

    try {
      const response = await axios.post("https://library-project-2bbk.onrender.com/add", {
        title,
        author,
      });

      if (response.data.isAddBook) {
        setSuccess(response.data.message);
        setError("");
        const newBook = {
          _id: response.data._id, // Ensure correct MongoDB ID
          title,
          author,
          availability: "Available", // Default to "Available" when adding a book
        };
        const updatedBooks = [...books, newBook].sort((a, b) =>
          a.title.localeCompare(b.title)
        ); // Sort after adding
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks); // Update search list with sorted books
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error adding book.");
      console.error("Add book error:", error);
    }

    // Reset input fields
    setTitle("");
    setAuthor("");
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredBooks(
      books
        .filter(
          (book) =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        )
        .sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically by title
    );
  };

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
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#1d7a34",
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
      <h2 style={styles.heading}>Add Books</h2>

      {/* Error and Success Messages */}
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {/* Add Book Form */}
      <form onSubmit={handleAddBook}>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <br />

        <label>Author: </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={styles.input}
        />
        <br />

        <button type="submit" style={styles.button}>
          Add Book
        </button>
      </form>

      {/* Search Books */}
      <h3>Search Books</h3>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={handleSearch}
        style={styles.input}
      />

      {/* Book List */}
      <h3>Book List</h3>
      <ul style={styles.bookList}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book._id} style={styles.bookItem}>
              {book.title} - {book.author} <strong>{book.availability}</strong>
            </li>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </ul>
    </div>
  );
};

export default AddBooks;
