import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3002/history", {
          headers: { "x-access-token": token },
        })
        .then((response) => {
          setHistory(response.data.borrowHistory || []); // Setting borrow history
        })
        .catch((error) => {
          console.error("Error fetching borrow history:", error);
        });
    }
  }, []);

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2>Borrow History</h2>
      <table border="1" style={{ marginTop: "10px", width: "100%" }}>
        <thead>
          <tr>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Returned</th>
          </tr>
        </thead>
        <tbody>
          {history.map(entry => (
            <tr key={entry.id}>
              <td>{entry.book}</td>
              <td>{entry.borrowDate}</td>
              <td>{entry.dueDate}</td>
              <td style={{ color: entry.dueDate < today ? "red" : "green" }}>
                {entry.dueDate < today ? "Overdue" : "On Time"}
              </td>
              <td>{entry.returned ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
