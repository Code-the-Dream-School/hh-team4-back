const express = require("express");
const Medication = require("../models/Medication");
const router = express.Router();
const ForbiddenError = require("../errors/forbidden");
const UnauthenticatedError = require("../errors/unauthenticated");
// Test MongoDB Connection
router.get("/test-db", async (req, res) => {
  try {
    // Create a test medication
    const testMedication = new Medication({
      name: "Ibuprofen",
      batchCode: "AX12345",
      expirationDate: new Date("2024-01-01"),
      type: "Antiinflammatory",
    });

    // Save to database
    await testMedication.save();

    // Retrieve all medications
    const medications = await Medication.find();

    res.status(200).json({
      message: "Database connection and Medication model are working!",
      medications,
    });
  } catch (error) {
    console.error("Error testing MongoDB connection:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//Trigger Validation Error Missing fields test
router.get("/test-validation-error", async (req, res, next) => {
  try {
    console.log("Testing for validation error");
    const invalidMedication = new Medication({
      // Missing required name field
      batchCode: "AX12345",
      expirationDate: new Date("2024-01-01"),
      type: "Antiinflammatory",
    });

    await invalidMedication.save(); // This will trigger a validation error
  } catch (error) {
    console.log("Validation error caught");
    next(error);
  }
});

//Trigger a cast error invalid id
router.get("/test-cast-error", async (req, res, next) => {
  try {
    console.log("Testing for Cast Error");
    const medication = await Medication.findById("invalid_id");
    res.status(200).json(medication);
  } catch (error) {
    next(error);
  }
});

//Trigger forbidden error
router.get("/test-forbidden-error", (req, res, next) => {
  try {
    console.log("Testing for Forbidden Error");
    throw new ForbiddenError("Access for this User is den denied");
  } catch (error) {
    next(error);
  }
});

//Trigger Unauthenticated error
router.get("/test-unauthenticated-error", (req, res, next) => {
  try {
    console.log("Testing for unAuthenticated Error");
    throw new UnauthenticatedError("You are not authenticated.");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
