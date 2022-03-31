import { Router } from "express";
import {
  createUser,
  signin,
  getUser,
  deleteUser,
  updateUser,
  deposit,
  reset,
} from "../controllers/users";
import { requireBuyer, verifyTokenMiddleware } from "../middleware/token";

const router = Router();

router.put("/", verifyTokenMiddleware, updateUser);
router.get("/", verifyTokenMiddleware, getUser);
router.delete("/", verifyTokenMiddleware, deleteUser);
router.post("/", createUser);
router.post("/deposit", verifyTokenMiddleware, requireBuyer, deposit);
router.get("/reset", verifyTokenMiddleware, requireBuyer, reset);
router.post("/signin", signin);

export default router;
