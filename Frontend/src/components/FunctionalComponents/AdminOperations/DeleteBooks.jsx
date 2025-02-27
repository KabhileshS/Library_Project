import { useState } from "react";

const DeleteBooks = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby by F. Scott Fitzgerald" },
    { id: 2, title: "To Kill a Mockingbird by Harper Lee" },
    { id: 3, title: "1984 by George Orwell" },
  ]);

  const [search, setSearch] = useState(""); // Search input state

  // Function to delete a book by its ID
  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Delete Books</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filteredBooks.length === 0 ? (
          <p>No books found</p>
        ) : (
          filteredBooks.map(book => (
            <li key={book.id}>
              {book.title} 
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DeleteBooks;
