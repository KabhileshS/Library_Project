const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signups", // References the User collection
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books", // References the Book collection
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now, // Automatically stores request timestamp
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending", // Default status when request is created
  },
});

module.exports = mongoose.model("Request", requestSchema);
