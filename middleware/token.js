import jwt from "jsonwebtoken";
import configs from "../configs";
import { BUYER_ROLE, SELLER_ROLE } from "../utilis/constants";
export async function verifyTokenMiddleware(req, res, next) {
  // Get auth header value
  const token = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof token !== "undefined") {
    // Set the token
    req.token = token;
    // Next middleware
    let { success, result } = await verifyTokenValid(req.token);
    if (!success)
      res.status(403).send({
        err: "Token not valid",
      });
    else {
      req.user = result?.user;
      next();
    }
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

export async function verifyTokenValid(token) {
  try {
    let result = await jwt.verify(token, configs.JWT_PRIVATE_KEY);
    return { success: true, result };
  } catch (error) {
    return { success: false };
  }
}
export const requireSeller = (req, res, next) => {
  const user = req.user;
  if (user.role === SELLER_ROLE) return next();
  res.status(401).send({ err: "wrong role" });
};
export const requireBuyer = (req, res, next) => {
  const user = req.user;
  if (user.role === BUYER_ROLE) return next();
  res.status(401).send({ err: "wrong role" });
};
