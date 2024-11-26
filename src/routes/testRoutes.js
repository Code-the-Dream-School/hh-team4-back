const express = require("express");
const Medication = require("../models/Medication");
const User = require("../models/UserModel");
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

// -----------------------------TESTING USER MODEL BEGINS-----------------------------------

// Test: Create a new user
router.post("/test-create-user", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Test: GET a user by email
router.get("/test-get-user", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.query.email }).select(
      "+password",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Trigger Validation Error Missing fields test
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

// Test: Validate password
router.post("/test-validate-password", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    res.status(200).json({ success: true, message: "Password is valid" });
  } catch (error) {
    next(error);
  }
});

// Trigger a cast error invalid id
router.get("/test-cast-error", async (req, res, next) => {
  try {
    console.log("Testing for Cast Error");
    const medication = await Medication.findById("invalid_id");
    res.status(200).json(medication);
  } catch (error) {
    next(error);
  }
});

// Test: Update user
router.put("/test-update-user/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Trigger forbidden error
router.get("/test-forbidden-error", (req, res, next) => {
  try {
    console.log("Testing for Forbidden Error");
    throw new ForbiddenError("Access for this User is denied");
  } catch (error) {
    next(error);
  }
});

// Test: Delete user
router.delete("/test-delete-user/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Trigger Unauthenticated error
router.get("/test-unauthenticated-error", (req, res, next) => {
  try {
    console.log("Testing for unAuthenticated Error");
    throw new UnauthenticatedError("You are not authenticated.");
  } catch (error) {
    next(error);
  }
});

// Test: Reset password
router.post("/test-reset-password", async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

// -----------------------------TESTING USER MODEL ENDS-----------------------------------

module.exports = router;
