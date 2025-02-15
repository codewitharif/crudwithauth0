const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    userId: { type: String, required: true }, // Auth0 user ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
