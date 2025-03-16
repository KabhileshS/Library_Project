import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFN] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [phoneNumber, setPN] = useState("");
  const [signing, setSigning] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setSigning(true);
    const REACT_APP_LOCAL="http://localhost:3002"
    const REACT_APP_DEPLOYED="https://library-project-2bbk.onrender.com"
    try {
      const apiUrl = process.env.NODE_ENV === "development" ? REACT_APP_LOCAL : REACT_APP_DEPLOYED; // Use environment variable or fallback to production URL
      const req = await axios.post(`${apiUrl}/signup`, {
        firstName: firstName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      });

      const message = req.data.message;
      const isSignup = req.data.isSignup;

      alert(message);
      if (isSignup) {
        navigate("/login");
      }
    } catch (error) {
      alert("Error signing up. Please try again.");
      console.error("Signup error:", error);
    }
    setSigning(false);
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "24px" }}>Signup Page</h1>
      <form onSubmit={handleSignup}>
        <label htmlFor="firstName" style={{ fontWeight: "bold", display: "block", margin: "10px 0" }}>
          First Name:
        </label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFN(e.target.value)}
          disabled={signing}
          required
          style={{
            width: "90%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #aaa",
          }}
        />
        
        <label htmlFor="email" style={{ fontWeight: "bold", display: "block", margin: "10px 0" }}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={signing}
          required
          style={{
            width: "90%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #aaa",
          }}
        />

        <label htmlFor="password" style={{ fontWeight: "bold", display: "block", margin: "10px 0" }}>
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          disabled={signing}
          required
          style={{
            width: "90%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #aaa",
          }}
        />

        <label htmlFor="phoneNumber" style={{ fontWeight: "bold", display: "block", margin: "10px 0" }}>
          Phone Number:
        </label>
        <input
          type="number"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPN(e.target.value)}
          disabled={signing}
          required
          style={{
            width: "90%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #aaa",
          }}
        />

        <button
          type="submit"
          disabled={signing}
          style={{
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            marginTop: "10px",
            width: "100%",
          }}
        >
          {signing ? "Signing Up..." : "Signup"}
        </button>
      </form>

      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
