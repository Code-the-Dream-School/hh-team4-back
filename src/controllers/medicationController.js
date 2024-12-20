const Medication = require("../models/Medication");
const User = require("../models/UserModel");
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

    // Fetch the user's name using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Assign the user's Name, Id, and Store to the created med
    const medicationData = {
      ...req.body,
      loggedBy: user.name,
      createdBy: user.id, // Assign the user's Id
      store: user.store, // Assign the user's store
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
};
