import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const req = await axios.post("http://localhost:3002/login", {
        email: email,
        password: password,
      });
      const message = req.data.message;
      const isLogin = req.data.isLogin;
      if (isLogin) {
        alert(message);
        localStorage.setItem("token", req.data.token);
        console.log(req.data.token);
        navigate("/search");
      } else {
        alert(message);
      }
    } catch (error) {
      alert("Error logging in. Please try again.");
      console.error("Login error:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "300px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form onSubmit={handleLogin}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>Login Page</h1>
        <label htmlFor="email" style={{ fontWeight: "bold", display: "block", margin: "10px 0" }}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{
            width: "90%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #aaa",
          }}
        />
        <br />
        <label htmlFor="password" style={{ fontWeight: "bold", display: "block", margin: "10px 0" }}>
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          disabled={loading}
          style={{
            width: "90%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #aaa",
          }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#007bff",
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        Create an Account?{" "}
        <Link to="/signup" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
