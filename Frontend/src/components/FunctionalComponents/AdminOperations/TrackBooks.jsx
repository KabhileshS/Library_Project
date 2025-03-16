import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const TrackBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://library-project-2bbk.onrender.com/track");
        setBooks(response.data.books);
      } catch (err) {
        setError("Failed to fetch books. Please check your connection.");
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (!book.dueDate) return filter === "all";
      const dueDateFormatted = new Date(book.dueDate).toISOString().split("T")[0];
      if (filter === "overdue") return dueDateFormatted < today;
      if (filter === "ontime") return dueDateFormatted >= today;
      return true;
    });
  }, [books, filter, today]);

  const searchedBooks = useMemo(() => {
    return filteredBooks
      .filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.borrower.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredBooks, search]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Track Borrowed Books</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading books...</p>}

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by title or borrower..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />

        <button onClick={() => setFilter("all")} aria-label="Show All Books">
          Show All
        </button>
        <button onClick={() => setFilter("ontime")} aria-label="Show On-Time Books">
          Show On Time
        </button>
        <button onClick={() => setFilter("overdue")} aria-label="Show Overdue Books">
          Show Overdue
        </button>
      </div>

      <h3>{filter.toUpperCase()}</h3>

      <table border="1" style={{ marginTop: "10px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Borrower</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {searchedBooks.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No books found</td>
            </tr>
          ) : (
            searchedBooks.map((book) => {
              const dueDateFormatted = book.dueDate
                ? new Date(book.dueDate).toISOString().split("T")[0]
                : "Not Available";

              return (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.borrower}</td>
                  <td>{dueDateFormatted}</td>
                  <td style={{ color: book.dueDate && dueDateFormatted < today ? "red" : "green" }}>
                    {book.dueDate && dueDateFormatted < today ? "Overdue" : "On Time"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrackBooks;
