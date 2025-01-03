const express = require("express");
const router = express.Router();
const { getAlertsByType } = require("../controllers/alertController");

// Route to fetch medications by alert type
router.get("/:type", getAlertsByType);

module.exports = router;
