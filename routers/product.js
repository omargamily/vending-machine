import { Router } from "express";
import { verifyTokenMiddleware, requireSeller } from "../middleware/token";
import {
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

export default router;
