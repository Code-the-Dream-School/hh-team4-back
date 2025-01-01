const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  dispenseMedication,
  getDispenseLogs,
} = require("../controllers/dispenseController");

const router = express.Router();

// POST /inventory/dispense Dispense medication
router.post(
  "/dispense",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  dispenseMedication,
);

// GET /inventory/dispense-logs Get dispense logs
router.get(
  "/dispense-logs",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  getDispenseLogs,
);

module.exports = router;
