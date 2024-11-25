const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; 

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have the required permissions.",
      });
    }

    next(); // proceed if user has required role
  };
};

module.exports = roleMiddleware;
