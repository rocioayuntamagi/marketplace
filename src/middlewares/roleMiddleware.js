export const roleRequired = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ msg: "No tienes permisos" });
    }
    next();
  };
};
