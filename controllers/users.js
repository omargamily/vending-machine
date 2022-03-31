import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configs from "../configs";
import { ALLOWED_COINS } from "../utilis/constants";

export const createUser = async (req, res, next) => {
  try {
    // validate user data in body
    let { username, password, role } = req.body;
    if (!username || !password || !role)
      return next({ status: 400, message: "missing field" });
    // look for user name
    const user = await User.findOne({ username });
    if (user) return next({ status: 400, message: "duplicate username" });
    // save user
    password = await bcrypt.hash(password, 10);
    await new User({ username, password, role }).save();
    res.status(200).send({ username, role });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  // get user from req
  // validate fields
  // update user
  const user = req.user;
  let { key, value } = req.body;
  const forbiddenKeys = ["username", "role", "deposit"];
  if (forbiddenKeys.includes(key))
    return next({ status: 400, message: "Cant change user " + key });
  if (key == "password") value = await bcrypt.hash(value, 10);

  User.updateOne({ username: user.username }, { [key]: value })
    .then(() => res.sendStatus(200))
    .catch((error) => next({ status: 500, message: error.message }));
};
export const deleteUser = (req, res, next) => {
  // delete user
  const user = req.user;
  User.remove({ username: user.username })
    .then((result) => res.sendStatus(200))
    .catch((error) => next({ status: 500, message: error.message }));
};

export const getUser = (req, res, next) => {
  try {
    // get query condition
    // get user
    const user = req.user;
    res.status(200).send({ user });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const deposit = async (req, res, next) => {
  try {
    // validate value is in [5,10,20,50,100]
    const { deposit } = req.body;
    let user = req.user;
    if (!ALLOWED_COINS.includes(deposit))
      return next({
        status: 400,
        message: "only 5,10,20,50,100 cents coins are accepted",
      });
    let { password, ...rest } = await User.findOneAndUpdate(
      { username: user.username },
      { $inc: { deposit } },
      { new: true }
    ).then((result) => (result?._doc ? result._doc : result));
    res.status(200).send(rest);
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const reset = async (req, res, next) => {
  try {
    // reset user deposit
    const user = req.user;
    let { password, ...rest } = await User.findOneAndUpdate(
      { username: user.username },
      { deposit: 0 },
      { new: true }
    ).then((result) => (result?._doc ? result._doc : result));
    res.status(200).send(rest);
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const signin = async (req, res, next) => {
  try {
    // reset user deposit
    const { username, password } = req.body;
    if (!username || !password)
      return next({ status: 400, message: "incorrect username or password" });
    const user = await User.findOne({ username });
    const same = await bcrypt.compare(password, user.password);
    if (!same)
      return next({ status: 400, message: "incorrect username or password" });
    const token = jwt.sign({ user }, configs.JWT_PRIVATE_KEY);
    res.status(200).send({ token });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
