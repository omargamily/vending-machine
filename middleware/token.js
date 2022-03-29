import jwt from "jsonwebtoken";
import configs from "../configs";

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
