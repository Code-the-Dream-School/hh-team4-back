const DispenseLog = require("../models/DispenseLog");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/UserModel");

const topEmployee = async (req, res) => {
  console.log("topEmployee controller running");
  try {
    // Aggregate logs to find the top 3 users with the most dispense entries
    const logs = await DispenseLog.aggregate([
      {
        $group: {
          _id: "$userId", // Group by userId
          dispenseCount: { $sum: 1 }, // Count logs for each user
        },
      },
      {
        $sort: { dispenseCount: -1 }, // Sort by highest dispense count
      },
      {
        $limit: 3, // Limit to top 3
      },
    ]);

    if (logs.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No dispense logs found.",
      });
    }

    // Fetch user details for the top 3 employees
    const topEmployees = await Promise.all(
      logs.map(async (log) => {
        const user = await User.findById(log._id).select("name store"); // Fetch the user using the userId (_id from the logs)
        return {
          user,
          dispenseCount: log.dispenseCount,
        };
      }),
    );

    res.status(StatusCodes.OK).json({
      success: true,
      topEmployees,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching top employees",
    });
  }
};
const outOfStock = async (req, res) => {
  console.log("outOfStock controller running");
  try {
    // Get the current date and calculate the date 30 days ago
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Find all dispense logs in the last 30 days
    const logs = await DispenseLog.find({
      dispenseDate: { $gte: thirtyDaysAgo, $lte: today },
    }).populate({
      path: "medicationId",
      select: "name quantity location", // Select medication fields
    });

    // Filter logs for medications with quantity 0 and track unique medicationId
    const uniqueMedications = {};
    const outOfStockMedications = [];

    logs.forEach((log) => {
      if (log.medicationId && log.medicationId.quantity === 0) {
        const medicationId = log.medicationId._id.toString();
        if (!uniqueMedications[medicationId]) {
          uniqueMedications[medicationId] = true;
          outOfStockMedications.push(log.medicationId);
        }
      }
    });

    res.status(StatusCodes.OK).json({
      success: true,
      medications: outOfStockMedications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching out-of-stock medications",
    });
  }
};

module.exports = {
  topEmployee,
  outOfStock,
};
