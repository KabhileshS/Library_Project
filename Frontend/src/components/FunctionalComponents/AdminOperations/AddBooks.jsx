import { useState } from "react";

const AddBooks = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, title: "1984", author: "George Orwell" },
  ]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Function to add a new book
  const handleAddBook = (e) => {
    e.preventDefault(); // Prevents page reload

    if (!title || !author) return; // Ensures fields are not empty

    const newBook = { id: books.length + 1, title, author };
    setBooks([...books, newBook]);

    // Reset input fields
    setTitle("");
    setAuthor("");
  };

  return (
    <div>
      <h2>Add Books</h2>

      <form onSubmit={handleAddBook}>
        <label>Title: </label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
        />
        <br />

        <label>Author: </label>
        <input 
          type="text" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          required
        />
        <br />

        <button type="submit">Add Book</button>
      </form>

      <h3>Book List</h3>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddBooks;
