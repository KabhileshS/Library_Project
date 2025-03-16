import { useState, useEffect } from "react";
import axios from "axios";

const SearchBooks = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3002/search");
        setBooks(response.data.books);
      } catch (error) {
        setError("Error fetching Books");
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  // Filter and sort books alphabetically
  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>Search Books</h2>
      <input
        type="text"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      />
      {loading && <p style={{ color: "#007bff" }}>Loading books...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: "0" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book._id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              <strong>{book.title}</strong> - {book.author} ---------{" "}
              <strong style={{ color: book.availability === "Available" ? "green" : "red", fontWeight: "bold" }}>
                {book.availability}
              </strong>
            </li>
          ))
        ) : (
          <li style={{ color: "gray", fontStyle: "italic" }}>No books found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBooks;
