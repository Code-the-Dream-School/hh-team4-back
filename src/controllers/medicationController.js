const Medication = require("../models/Medication");
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
  const medication = await Medication.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: medication });
  console.log("Create Medication");
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
