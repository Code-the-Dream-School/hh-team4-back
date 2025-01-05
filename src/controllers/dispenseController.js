const DispenseLog = require("../models/DispenseLog");
const Medication = require("../models/Medication");
const { StatusCodes } = require("http-status-codes");

// Dispense Medication
const dispenseMedication = async (req, res) => {
  try {
    const { medicationId, quantity } = req.body;

    // Find Medication and populate creator's details
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
    if (medication.location !== req.user.store) {
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

    // Populate medication and user details in the response
    const populatedLog = await log.populate([
      {
        path: "medicationId",
        select: "name ndc lot class location quantity",
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
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

const getDispenseLogs = async (req, res) => {
  try {
    // Fetch dispense logs and populate medication and user details
    const logs = await DispenseLog.find()
      .populate({
        path: "medicationId",
        select: "name ndc lot class quantity", // Add any other fields you need
      })
      .populate({
        path: "userId",
        select: "name store", // Add any other fields you need
      });

    res.status(StatusCodes.OK).json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching dispense logs",
    });
  }
};

module.exports = {
  dispenseMedication,
  getDispenseLogs,
};
