const Medication = require("../models/Medication");
const User = require("../models/UserModel");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getMedications = async (req, res, next) => {
  try {
    const medications = await Medication.find();
    res.status(StatusCodes.OK).json({ success: true, data: medications });
  } catch (error) {
    next(error);
  }
};

const getMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findById(id);
    if (!medication) {
      throw new NotFoundError(`No medication found with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

const createMedication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    }

    const medicationData = {
      ...req.body,
      createdBy: user.id,
      location: user.store, // Set Meds location value from the user's store
    };
    const medication = await Medication.create(medicationData);
    res.status(StatusCodes.CREATED).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

const updateMedication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medication) {
      throw new NotFoundError(`No medication found with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

const deleteMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByIdAndDelete(id);
    if (!medication) {
      throw new NotFoundError(`No medication found with id: ${id}`);
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Medication deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
};
