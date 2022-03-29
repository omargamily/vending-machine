import { Router } from "express";
import userRouter from "./users.js";
import productRouter from "./product.js";

const router = Router();

router.use("/user", userRouter);
router.use("/product", productRouter);

export default router;
