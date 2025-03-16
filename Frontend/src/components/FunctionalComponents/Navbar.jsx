import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react'
import '../css/Navbar.css'
import axios from "axios"

const Navbar = () => {
  var [dropdown,setDropdown] = useState(false)
  var [dropdown1,setDropdown1] = useState(false)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://library-project-2bbk.onrender.com/getUserDetails", {
          headers: { "x-access-token": token },
        })
        .then((response) => {
          setUser(response.data); // Set user data in state
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  return (
    <header>
      <h1>The Library Management System</h1>
        <nav>
            {/* <li><Link to='/home' className="link">Home</Link></li> */}
            <li><Link to='/search' className="link">Search</Link></li>
            <div className="dropdown" onMouseEnter={()=>setDropdown(true)} onMouseLeave={()=>setDropdown(false)}>
              <span className='link'>User Activities</span>
              {dropdown && 
                  (<ol className="dropdown-list">
                    <li><Link to="/history" className='dropdown-link'>Borrowed History</Link></li>
                    <li><Link to="/requestbook" className='dropdown-link'>Borrow Request</Link></li>
              </ol>)}
            </div>
            {user && (user.role === "admin" || user.role === "Admin") &&
            (            
            <div className="dropdown" onMouseEnter={()=>setDropdown1(true)} onMouseLeave={()=>setDropdown1(false)}>
            <span className='link'>Admin Activities</span>
            {dropdown1 && 
                (<ol className="dropdown-list">
                  <li><Link to="/add" className='dropdown-link'>Add Books</Link></li>
                  <li><Link to="/delete" className='dropdown-link'>Delete Books</Link></li>
                  <li><Link to="/track" className='dropdown-link'>Track Books</Link></li>
                  <li><Link to="/requests" className='dropdown-link'>Manage Requests</Link></li>
                  <li><Link to="/returns" className='dropdown-link'>Returned Books</Link></li>
            </ol>)}
          </div>)}

            <li><Link to='/contact' className="link">Contact</Link></li>

            <li><Link to='/userdetails' className="link">{user?.role ? user.role.toUpperCase() : "Profile"}</Link></li>
        </nav>
    </header>
  )
}
export default Navbar
