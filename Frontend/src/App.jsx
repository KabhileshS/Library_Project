// import Home from "./components/FunctionalComponents/Home";
import Login from "./components/FunctionalComponents/Login";
import Signup from "./components/FunctionalComponents/Signup";
import Navbar from "./components/FunctionalComponents/Navbar";
import History from "./components/FunctionalComponents/UserOperations/History";
import Contact from "./components/FunctionalComponents/Contact";
import SearchBooks from "./components/FunctionalComponents/SearchBooks";
import AddBooks from "./components/FunctionalComponents/AdminOperations/AddBooks";
import DeleteBooks from "./components/FunctionalComponents/AdminOperations/DeleteBooks"
import TrackBooks from "./components/FunctionalComponents/AdminOperations/TrackBooks";
import ManageRequests from "./components/FunctionalComponents/AdminOperations/ManageRequests";
import Returns from "./components/FunctionalComponents/AdminOperations/Returns";
import Request from "./components/FunctionalComponents/UserOperations/Request"
import UserDetails from "./components/FunctionalComponents/UserDetails";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Navigate } from "react-router-dom";
function App() {
  return (
    <>
      <div>
        <main>
          <BrowserRouter>
          {/* <Navbar /> */}
            <Routes>
              {/* Redirect to Signup first */}
              <Route path="/" element={<Navigate to="/signup" />} />

              {/* Signup and Login pages without Navbar */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes (After Login) */}
              {/* <Route path="/home" element={<><Navbar /><Home /></>} /> */}
              <Route path="/search" element={<><Navbar /><SearchBooks /></>} />
              <Route path="/history" element={<><Navbar /><History /></>} />
              <Route path="/add" element={<><Navbar /><AddBooks /></>} />
              <Route path="/delete" element={<><Navbar /><DeleteBooks /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /></>} />
              <Route path="/track" element={<><Navbar /><TrackBooks /></>} />
              <Route path="/returns" element={<><Navbar /><Returns /></>} />
              <Route path="/requests" element={<><Navbar /><ManageRequests /></>} />
              <Route path="/requestbook" element={<><Navbar /><Request /></>} />
              <Route path="/userdetails" element={<><Navbar /><UserDetails /></>} />
              {/* Redirect unknown routes to Signup */}
              <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
          </BrowserRouter>
        </main>
      </div>
    </>
  );
}

export default App;
