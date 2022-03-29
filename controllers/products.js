import Product from "../models/products";

export const createProduct = (req, res, next) => {
  try {
    // validate product data in body
    // save product
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const updateProduct = (req, res, next) => {
  try {
    // get user from req
    // validate fields
    // if product is for user update
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
export const deleteProduct = (req, res, next) => {
  try {
    // get user from req
    // delete product if belong to user
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const getProduct = (req, res, next) => {
  try {
    // get query condition
    // get produvt
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const buy = (req, res, next) => {
  try {
    // get product id and quantity from body
    // validate quantity > 0 & q < p.amount
    // check if pid is found
    // check if user got money deposit >= price
    // calculate change
    // send products purchased ,total spent, change for user
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
