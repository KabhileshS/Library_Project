const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  borrowRequests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
      requestDate: { type: Date, default: Date.now },
    },
  ],
  borrowHistory: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      borrowDate: { type: Date, default: Date.now },
      dueDate: { type: Date, required: true },
      returned: { type: Boolean, default: false },
    },
  ],
});


const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
