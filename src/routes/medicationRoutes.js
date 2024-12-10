const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
} = require("../controllers/medicationController");

const router = express.Router();

// GET /inventory: Get all medications
router.get(
  "/",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  getMedications,
);

// GET /inventory:id Get single medication
router.get(
  "/:id",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  getMedication,
);

// POST /inventory: add a new medication

router.post("/", authenticate, createMedication);

router.post(
  "/",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  createMedication,
);

// PUT /inventory:id Update item by id
router.patch(
  "/:id",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  updateMedication,
);

//DELETE /inventory:id Delete item by id
router.delete(
  "/:id",
  authenticate,
  roleMiddleware(["admin", "clerk", "inventoryManager"]),
  deleteMedication,
);

module.exports = router;
