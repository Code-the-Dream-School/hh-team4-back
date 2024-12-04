const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

// Create a new user
router.post("/", authenticate, roleMiddleware(["admin"]), createUser);

// Get all users
router.get("/", authenticate, roleMiddleware(["admin"]), getAllUsers);

// Update a user by ID
router.put("/:id", authenticate, roleMiddleware(["admin"]), updateUser);

// Delete a user by ID
router.delete("/:id", authenticate, roleMiddleware(["admin"]), deleteUser);

module.exports = router;
