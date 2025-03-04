const express = require("express");
const {
  signup,
  login,
  validatePassword,
  resetPassword,
} = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/validate-password", validatePassword); // Route for validating a password
router.post("/reset-password", resetPassword); // Route for resetting a password

router.get(
  "/admin-dashboard",
  authenticate, // Ensure user is logged in
  roleMiddleware(["admin"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome, Admin!" });
  },
);

router.get(
  "/inventory-manager",
  authenticate,
  roleMiddleware(["admin", "inventoryManager"]), // Admins and inventory managers can access
  (req, res) => {
    res.status(200).json({ message: "Welcome, Inventory Manager!" });
  },
);

router.get(
  "/clerk-dashboard",
  authenticate,
  roleMiddleware(["admin", "inventoryManager", "clerk"]), // Allow clerk access
  (req, res) => {
    res.status(200).json({ message: "Welcome, Clerk!" });
  },
);

module.exports = router;
