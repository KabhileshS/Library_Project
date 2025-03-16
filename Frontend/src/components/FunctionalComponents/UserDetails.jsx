import { useEffect, useState } from "react";
import axios from "axios";

const UserDetails = () => {
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
    <footer
      style={{
        background: "#f8f9fa",
        padding: "20px",
        textAlign: "center",
        borderTop: "2px solid #ddd",
        marginTop: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {user ? (
        <div>
          <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>
            Welcome, {user?.firstName}!
          </h1>
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "10px 0",
              fontSize: "18px",
              color: "#555",
            }}
          >
            <li>
              <strong>Name:</strong> {user?.firstName}
            </li>
            <li>
              <strong>Email:</strong> {user?.email}
            </li>
            <li>
              <strong>Phone No:</strong> {user?.phoneNumber}
            </li>
            <li>
              <strong>Role: </strong> {user?.role}
            </li>
          </ul>
        </div>
      ) : (
        <h1 style={{ color: "#007bff", fontSize: "22px" }}>Loading user details...</h1>
      )}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect
        }}
        style={{
          background: "#dc3545",
          color: "white",
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Logout
      </button>
    </footer>
  );
};

export default UserDetails;
