import { useState } from "react";

const History = () => {
  const [history, setHistory] = useState([
    { id: 1, book: "The Great Gatsby", borrowDate: "2024-02-10", dueDate: "2025-02-28" },
    { id: 2, book: "1984", borrowDate: "2024-02-15", dueDate: "2024-02-25" },
    { id: 3, book: "To Kill a Mockingbird", borrowDate: "2024-02-18", dueDate: "2024-02-22" },
  ]);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
