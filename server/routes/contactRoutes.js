const express = require("express");
const Contact = require("../models/Contact");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Add Contact
router.post("/", authenticate, async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.sub;

  try {
    const contact = new Contact({ name, phone, userId });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving contact", error: err.message });
  }
});

// Get User Contacts
router.get("/", authenticate, async (req, res) => {
  const userId = req.user.sub;

  try {
    const contacts = await Contact.find({ userId });
    res.status(200).json(contacts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching contacts", error: err.message });
  }
});

module.exports = router;
