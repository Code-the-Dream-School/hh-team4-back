const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getAUser,
} = require("../controllers/userController");

const router = express.Router();

// Create a new user
router.post(
  "/",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  createUser,
);

// Get all users
router.get(
  "/",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  getAllUsers,
);

// Get a user by ID
router.get(
  "/:id",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  getAUser,
);

// Update a user by ID
router.put(
  "/:id",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  updateUser,
);

// Delete a user by ID
router.delete(
  "/:id",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  deleteUser,
);

module.exports = router;
