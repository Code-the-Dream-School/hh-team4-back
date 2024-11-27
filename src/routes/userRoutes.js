const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

module.exports = router;
