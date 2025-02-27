import { useState } from "react";

const ManageRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, user: "John", book: "The Great Gatsby", status: "Pending" },
    { id: 2, user: "Emma", book: "1984", status: "Pending" },
    { id: 3, user: "David", book: "To Kill a Mockingbird", status: "Approved" },
  ]);

  const [search, setSearch] = useState("");

  // Function to update request status
  const updateRequest = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    )); // Update status instead of removing
    alert(`Request ${newStatus}`);
  };

  // Filter requests based on search query
  const filteredRequests = requests.filter(req =>
    req.status === "Pending" &&
    (req.book.toLowerCase().includes(search.toLowerCase()) ||
     req.user.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h2>Manage Borrow Requests</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by user or book..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {filteredRequests.map(request => (
            <li key={request.id}>
              {request.user} requested <b>{request.book}</b>
              <button onClick={() => updateRequest(request.id, "Approved")}>Approve ✅</button>
              <button onClick={() => updateRequest(request.id, "Rejected")}>Reject ❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageRequests;
