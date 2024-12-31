const Medication = require("../models/Medication");
const User = require("../models/UserModel");
const DispenseLog = require("../models/DispenseLog");
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
    };
    const medication = await Medication.create(medicationData);
    res.status(StatusCodes.CREATED).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

const dispenseMedication = async (req, res, next) => {
  try {
    const { medicationId, quantity } = req.body;
    const medication = await Medication.findById(medicationId).populate({
      path: "createdBy",
      select: "store",
    });

    if (!medication) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Medication not Found" });
    }

    if (medication.createdBy.store !== req.user.store) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "You are not authorized to dispense medication from this store.",
      });
    }

    if (medication.quantity < quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    medication.quantity -= quantity;
    await medication.save();

    const log = await DispenseLog.create({
      medicationId,
      userId: req.user.id,
      quantity,
      dispenseDate: new Date(),
    });

    const populatedLog = await log.populate([
      { path: "medicationId", select: "name ndc lot" },
      { path: "userId", select: "name store" },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Medication dispensed successfully",
      log: populatedLog,
    });
  } catch (error) {
    next(error);
  }
};

const getDispenseLogs = async (req, res, next) => {
  try {
    const logs = await DispenseLog.find();
    res.status(StatusCodes.OK).json({ success: true, data: logs });
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
  dispenseMedication,
  getDispenseLogs,
};
