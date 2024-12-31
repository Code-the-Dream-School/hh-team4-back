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

    // Populate medication and user details in the response
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
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

// Dispense Log Retrieval
const getDispenseLogs = async (req, res) => {
  const logs = await DispenseLog.find();
  res.status(StatusCodes.OK).json({ success: true, data: logs });
};

module.exports = {
  dispenseMedication,
  getDispenseLogs,
};
