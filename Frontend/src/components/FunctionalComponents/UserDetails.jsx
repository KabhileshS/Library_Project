import { useEffect, useState } from "react";
import axios from "axios";

const UserDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3002/getUserDetails", {
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
    <footer>
      {user ? (
        <h1>
          Welcome, 
          <ul>
            <li>Name:{user?.firstName}</li>
            <li>Email:{user?.email} </li>
            <li>PhoneNo:{user?.phoneNumber}!</li>
        </ul> 
        </h1>
      ) : (
        <h1>Loading user details...</h1>
      )}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect
        }}>Logout</button>

    </footer>
  );
};

export default UserDetails;
