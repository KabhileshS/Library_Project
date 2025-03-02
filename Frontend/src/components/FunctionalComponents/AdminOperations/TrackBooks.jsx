import { useState } from "react";

const TrackBooks = () => {
  const [filter, setFilter] = useState("all"); // 'all', 'borrowed', 'overdue'
  const [search, setSearch] = useState(""); // Search input state

  const borrowedBooks = [
    { id: 1, title: "The Great Gatsby", borrower: "Alice", dueDate: "2025-02-20" },
    { id: 2, title: "To Kill a Mockingbird", borrower: "Bob", dueDate: "2025-03-05" },
    { id: 3, title: "1984", borrower: "Charlie", dueDate: "2025-02-25" },
  ];

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Filter books based on selection
  const filteredBooks = borrowedBooks.filter((book) => {
    if (filter === "overdue") return book.dueDate <= today;
    else if (filter === "ontime") return book.dueDate > today;
    return true; // Show all books by default
  });

  // Apply search filter
  const searchedBooks = filteredBooks.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.borrower.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Track Borrowed Books</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or borrower..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter Buttons */}
      <button onClick={() => setFilter("all")}>Show All</button>
      <button onClick={() => setFilter("ontime")}>Show OnTime</button>
      <button onClick={() => setFilter("overdue")}>Show Overdue</button>
      <h3>{filter.toUpperCase()}</h3>
      <table border="1" style={{ marginTop: "10px" }}>
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
            searchedBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.borrower}</td>
                <td>{book.dueDate}</td>
                <td style={{ color: book.dueDate < today ? "red" : "green" }}>
                  {book.dueDate < today ? "Overdue" : "On Time"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrackBooks;
