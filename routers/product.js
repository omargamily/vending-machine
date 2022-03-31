import { Router } from "express";
import {
  verifyTokenMiddleware,
  requireSeller,
  requireBuyer,
} from "../middleware/token";
import {
  buy,
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controllers/products";

const router = Router();

router.post("/", verifyTokenMiddleware, requireSeller, createProduct);
router.get("/", getProduct);
router.delete("/", verifyTokenMiddleware, requireSeller, deleteProduct);
router.put("/", verifyTokenMiddleware, requireSeller, updateProduct);
router.post("/buy", verifyTokenMiddleware, requireBuyer, buy);

export default router;
