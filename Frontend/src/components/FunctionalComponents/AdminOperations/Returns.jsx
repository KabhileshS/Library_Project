import { useState } from "react";

const Returns = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([
    { id: 1, title: "The Great Gatsby", borrower: "John", dueDate: "2024-02-20", returned: false },
    { id: 2, title: "1984", borrower: "Emma", dueDate: "2024-02-25", returned: false },
    { id: 3, title: "To Kill a Mockingbird", borrower: "David", dueDate: "2024-02-28", returned: false },
  ]);

  const [search, setSearch] = useState("");

  // Function to mark a book as returned
  const handleReturn = (id) => {
    setBorrowedBooks(
      borrowedBooks.map(book =>
        book.id === id ? { ...book, returned: true } : book
      )
    );
  };

  // Filter books based on search query
  const filteredBooks = borrowedBooks.filter(book =>
    !book.returned &&
    (book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.borrower.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h2>Update Returned Books</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or borrower..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredBooks.length === 0 ? (
        <p>No books found or all books have been returned.</p>
      ) : (
        <ul>
          {filteredBooks.map(book => (
            <li key={book.id}>
              <b>{book.title}</b> - Borrowed by {book.borrower} (Due: {book.dueDate}) 
              <button onClick={() => handleReturn(book.id)}>Mark as Returned ✅</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Returns;
