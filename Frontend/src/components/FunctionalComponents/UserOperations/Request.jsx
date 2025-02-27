import { useState } from "react";

const Request = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", available: true },
    { id: 3, title: "1984", author: "George Orwell", available: false }, // Unavailable book
  ]);

  const requestBook = (id) => {
    setBooks(books.map(book => book.id === id ? { ...book, available: false } : book));
    alert("Book requested successfully!");
  };

  return (
    <div>
      <h2>Request to Borrow Books</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Filter & Display Books */}
      <ul>
        {books
          .filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
          )
          .map((book) => (
            <li key={book.id}>
              {book.title} - {book.author} {book.available ? "(Available)" : "(Not Available)"}
              {book.available && (
                <button onClick={() => requestBook(book.id)}>Request</button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Request;
