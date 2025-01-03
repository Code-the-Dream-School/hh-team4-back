const Medication = require("../models/Medication");
const calculateAlerts = require("../utils/calculateAlerts");

// Controller to fetch medications by alert type
const getAlertsByType = async (req, res, next) => {
  try {
    const medications = await Medication.find();
    const alerts = calculateAlerts(medications);

    const { type } = req.params;
    const validTypes = [
      "lowStock",
      "outOfStock",
      "nearingExpiration",
      "expired",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid alert type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    res.status(200).json({
      success: true,
      alertType: type,
      data: alerts[type],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlertsByType,
};
