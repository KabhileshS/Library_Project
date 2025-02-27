import { Link } from 'react-router-dom'
import { useState } from 'react'
// import '../css/Navbar.css'

const Navbar = () => {
  var [dropdown,setDropdown] = useState(false)
  var [dropdown1,setDropdown1] = useState(false)

  return (
    <header>
        <nav>
            <li><Link to='/home'>Home</Link></li>
            <li><Link to='/login'>Login</Link></li>
        </nav>
    </header>
  )
}
export default Navbar
