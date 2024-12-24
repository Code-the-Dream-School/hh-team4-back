const Medication = require("../models/Medication");
const User = require("../models/UserModel");
const DispenseLog = require("../models/DispenseLog");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

// Fetch all medications
const getMedications = async (req, res) => {
  const medications = await Medication.find();
  res.status(StatusCodes.OK).json({ success: true, data: medications });
  console.log("Fetch All Medications");
};

// Fetch a Single medication
const getMedication = async (req, res) => {
  const { id } = req.params;
  const medication = await Medication.findById(id);
  if (!medication) {
    throw new NotFoundError(`No medication found with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: medication });
  console.log("Fetch Single Medication");
};

// Create a medication
const createMedication = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Assign the user's Name, Id, and Store to the created med
    const medicationData = {
      ...req.body,
      createdBy: user.id, // Assign the user's Id
    };

    // Create a new medication record with the user's name
    const medication = await Medication.create(medicationData);

    res.status(StatusCodes.CREATED).json({ success: true, data: medication });
    console.log("Create Medication");
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
    console.error("Error creating medication:", error);
  }
};

// Dispense Medication
const dispenseMedication = async (req, res) => {
  try {
    const { medicationId, quantity } = req.body;

    console.log("Dispensing medication with ID:", medicationId); // Debug log

    //Find Medication and populate creators details
    const medication = await Medication.findById(medicationId).populate({
      path: "createdBy",
      select: "store",
    });

    if (!medication) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Medication not Found" });
    }

    // Ensure User Store matches Medication Store
    if (medication.createdBy.store !== req.user.store) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "You are not authorized to dispense medication from this store.",
      });
    }

    // Ensure we have enough in stock
    if (medication.quantity < quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    // Deduct quantity and save
    medication.quantity -= quantity;
    await medication.save();

    // Log Dispense Action
    const log = await DispenseLog.create({
      medicationId,
      userId: req.user.id,
      quantity,
      dispenseDate: new Date(),
    });

    //Populate medication and user details in the response

    const populatedLog = await log.populate([
      {
        path: "medicationId",
        select: "name ndc lot",
      },
      {
        path: "userId",
        select: "name store",
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Medication dispensed successfully",
      log: populatedLog,
    });

    console.log("Medication Dispensed");
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
    console.error("Error dispensing medication:", error);
  }
};

// Dispense Log Retrieval
const getDispenseLogs = async (req, res) => {
  const logs = await DispenseLog.find();
  res.status(StatusCodes.OK).json({ success: true, data: logs });
  console.log("Fetch All Logs");
};

// Update an existing medication
const updateMedication = async (req, res) => {
  const { id } = req.params;
  const medication = await Medication.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!medication) {
    throw new NotFoundError(`No medication found with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: medication });
  console.log("Changes a medication");
};

// Delete a medication
const deleteMedication = async (req, res) => {
  const { id } = req.params;
  const medication = await Medication.findByIdAndDelete(id);
  if (!medication) {
    throw new NotFoundError(`No medication found with id: ${id}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Medication deleted successfully" });
  console.log("Delete Medication");
};

module.exports = {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  dispenseMedication,
  getDispenseLogs,
};
