import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/solo-logueados", authRequired, (req, res) => {
  res.json({ msg: "Acceso permitido", user: req.user });
});

router.get("/solo-admin", authRequired, roleRequired("admin"), (req, res) => {
  res.json({ msg: "Bienvenida admin" });
});

export default router;
