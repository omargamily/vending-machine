import { Router } from "express";
import {
  createUser,
  signin,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/users";
import { verifyTokenMiddleware } from "../middleware/token";

const router = Router();

router.put("/", verifyTokenMiddleware, updateUser);
router.get("/", verifyTokenMiddleware, getUser);
router.delete("/", verifyTokenMiddleware, deleteUser);
router.post("/", createUser);
router.post("/signin", signin);

export default router;
