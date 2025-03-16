import { useState, useEffect } from "react";
import axios from "axios";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://library-project-2bbk.onrender.com/requests");
        setRequests(response.data.requests);
      } catch (error) {
        setError("Error fetching requests");
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const updateRequest = async (id, userId, bookId, newStatus) => {
    try {
      const endpoint = newStatus === "Approved" ? "accept" : "reject";
      const response = await axios.post(`https://library-project-2bbk.onrender.com/${endpoint}`, {
        requestId: id,
        userId,
        bookId
      });

      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );
        alert(`Request ${newStatus}`);
      } else {
        alert("Failed to update request.");
      }
    } catch (error) {
      console.error(`Error updating request (${newStatus}):`, error);
      alert("Error updating request.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Borrow Requests</h2>

      <input
        type="text"
        placeholder="Search by user or book..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {loading && <p style={styles.loading}>Loading requests...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {requests.length === 0 ? (
        <p style={styles.noRequests}>No pending requests.</p>
      ) : (
        <ul style={styles.list}>
          {requests
            .filter(
              (req) =>
                req.status === "Pending" &&
                (req.title.toLowerCase().includes(search.toLowerCase()) ||
                 req.requester.toLowerCase().includes(search.toLowerCase()))
            )
            .map((request) => (
              <li key={request._id} style={styles.listItem}>
                <span>
                  <b>{request.requester}</b> requested <b>{request.title}</b>
                </span>
                <div>
                  <button
                    style={styles.approveButton}
                    onClick={() => updateRequest(request._id, request.userId, request.bookId, "Approved")}
                  >
                    Approve ✅
                  </button>
                  <button
                    style={styles.rejectButton}
                    onClick={() => updateRequest(request._id, request.userId, request.bookId, "Rejected")}
                  >
                    Reject ❌
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

// Inline styles for a clean UI
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  loading: {
    textAlign: "center",
    color: "#555",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  noRequests: {
    textAlign: "center",
    color: "#777",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  approveButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ManageRequests;
