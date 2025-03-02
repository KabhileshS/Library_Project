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
        const response = await axios.get("http://localhost:3002/requests");
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
      const response = await axios.post(`http://localhost:3002/${endpoint}`, {
        requestId: id,
        userId,
        bookId
      });

      if (response.status === 200) {
        setRequests(requests.map(req => (req._id === id ? { ...req, status: newStatus } : req)));
        alert(`Request ${newStatus}`);
      } else {
        alert("Failed to update request.");
      }
    } catch (error) {
      console.error(`Error updating request (${newStatus}):`, error);
      alert("Error updating request.");
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.status === "Pending" &&
      (req.book.toLowerCase().includes(search.toLowerCase()) || req.user.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h2>Manage Borrow Requests</h2>

      <input
        type="text"
        placeholder="Search by user or book..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading requests...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {filteredRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {filteredRequests.map((request) => (
            <li key={request._id}>
              {request.user} requested <b>{request.book}</b>
              <button onClick={() => updateRequest(request._id, request.userId, request.bookId, "Approved")}>
                Approve ✅
              </button>
              <button onClick={() => updateRequest(request._id, request.userId, request.bookId, "Rejected")}>
                Reject ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageRequests;
