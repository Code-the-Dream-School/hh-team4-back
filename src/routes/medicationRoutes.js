const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
} = require("../controllers/medicationController");

const router = express.Router();

// GET /inventory: Get all medications
router.get("/", getMedications);

// GET /inventory:id Get single medication
router.get("/:id", getMedication);

// POST /inventory: add a new medication
router.post("/", authenticate, createMedication);

// PUT /inventory:id Update item by id
router.patch("/:id", updateMedication);

//DELETE /inventory:id Delete item by id
router.delete("/:id", deleteMedication);

module.exports = router;
