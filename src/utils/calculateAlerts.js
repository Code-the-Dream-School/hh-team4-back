const calculateAlerts = (medications) => {
  const currentDate = new Date();
  const alerts = {
    lowStock: [],
    outOfStock: [],
    nearingExpiration: [],
    expired: [],
  };

  medications.forEach((med) => {
    if (med.quantity === 0) {
      alerts.outOfStock.push(med);
    } else if (med.quantity <= med.threshold) {
      alerts.lowStock.push(med);
    }
    if (
      med.expirationDate &&
      new Date(med.expirationDate) <
        new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) &&
      new Date(med.expirationDate) > currentDate
    ) {
      alerts.nearingExpiration.push(med);
    }
    if (med.expirationDate && new Date(med.expirationDate) <= currentDate) {
      alerts.expired.push(med);
    }
  });

  return alerts;
};

module.exports = calculateAlerts;
