import User from "../models/user";

export const addUser = (req, res, next) => {
  try {
    // validate user data in body
    // save user
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const updateUser = (req, res, next) => {
  try {
    // get user from req
    // validate fields
    // update user
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
export const deleteUser = (req, res, next) => {
  try {
    // get user from req
    // delete user
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const getUser = (req, res, next) => {
  try {
    // get query condition
    // get user
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const deposit = (req, res, next) => {
  try {
    // validate value is in [5,10,20,50,100]
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const reset = (req, res, next) => {
  try {
    // reset user deposit
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
