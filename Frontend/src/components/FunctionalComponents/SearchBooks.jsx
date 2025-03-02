import { useState,useEffect } from "react";
import axios from "axios";
const SearchBooks = () => {
  const [query, setQuery] = useState("");
  const [books,setBooks]=useState([])
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  useEffect(()=>{
    const fetchBooks=async()=>{
      setLoading(true)
      try{
        const response=await axios.get("http://localhost:3002/search")
        setBooks(response.data.books)
      }
      catch(error){
        setError("Error fetching Books")
        console.error("Fetch error:",error)
      }
      setLoading(false);
    }
    fetchBooks();
  },[])

  const filteredBooks=books.filter(book=>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    
  )

  return (
    <div>
      <h2>Search Books</h2>
      <input
        type="text"
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? <p>Loading books...</p> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <ul>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> - {book.author}
            </li>
          ))
        ) : (
          <li>No books found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBooks;
