import Product from "../models/products";
import { ALLOWED_COINS } from "../utilis/constants";

export const createProduct = async (req, res, next) => {
  try {
    // validate product data in body
    // save product
    const { productName, amountAvaliable, cost } = req.body;
    const user = req.user;
    if (!productName || !amountAvaliable || !cost)
      return next({ status: 400, message: "missing field" });
    const product = await Product.findOne({ productName });
    if (product)
      return next({ status: 400, message: "item with same name found" });
    await new Product({
      productName,
      amountAvaliable,
      cost,
      sellerId: user._id,
    }).save();
    res.status(200).send({ productName, amountAvaliable, cost });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    // get user from req
    // validate fields
    // if product is for user update
    const { key, value, productId } = req.body;
    const user = req.user;

    if (!key || value == null || value == undefined || !productId)
      return next({ status: 400, message: "missing parameter" });
    if (["productName", "sellerId"].includes(key))
      return next({ status: 400, message: "can't change a product's " + key });
    if (value === 0)
      return next({ status: 400, message: `product ${key} can't be 0` });
    if (value < 0)
      return next({
        status: 400,
        message: `product ${key} can't be less than 0`,
      });
    if (!productId) return next({ status: 400, message: "missing paramter" });
    if (productId.length < 24)
      return next({ status: 404, message: "product not found" });
    let product = await Product.findById(productId);
    if (!product) return next({ status: 404, message: "product not found" });
    if (product.sellerId.toString() !== user._id)
      next({ status: 401, message: "unauthorized" });

    product = await Product.findByIdAndUpdate(
      productId,
      { [key]: value },
      { new: true }
    );
    res.status(200).send(product);
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    const user = req.user;
    if (!id) return next({ status: 400, message: "missing paramter" });
    if (id.length < 24)
      return next({ status: 404, message: "product not found" });

    const product = await Product.findById(id);

    if (!product) return next({ status: 404, message: "product not found" });
    if (product.sellerId.toString() !== user._id)
      return next({ status: 401, message: "unauthorized" });

    await Product.remove({ _id: id });
    res.status(200).send({ id });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const getProduct = (req, res, next) => {
  // get query condition
  // get product
  Product.find({})
    .then((result) => res.status(200).send({ products: result }))
    .catch((err) => next({ status: 500, message: error.message }));
};

export const buy = async (req, res, next) => {
  try {
    // get product id and quantity from body
    const { productId, quantity } = req.body;
    const user = req.user;
    if (!productId || quantity === undefined || quantity === null)
      return next({ status: 400, message: "missing parameter" });
    if (productId.length < 24)
      return next({ status: 404, message: "product not found" });

    const product = await Product.findById(productId).then((result) =>
      result?._doc ? result._doc : result
    );
    if (!product) return next({ status: 404, message: "product not found" });

    // validate quantity > 0 & q < p.amount
    if (quantity === 0)
      return next({ status: 400, message: "quantity must be > 0" });
    if (quantity > product.amountAvaliable)
      return next({
        status: 400,
        message: "no enough products to satisfy this amount",
      });
    if (quantity % 1 !== 0)
      return next({
        status: 400,
        message: "quantity must be a whole number",
      });
    const totalCost = product.cost * quantity;
    if (totalCost > user.deposit)
      return next({ status: 400, message: "not enough deposit" });

    const difference = user.deposit - totalCost;
    const change = getChange(difference);
    res.status(200).send({ products: productId, total: totalCost, change });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};
export const getChange = (difference) => {
  let change = [],
    i = 0;
  while (difference !== 0) {
    if (i > ALLOWED_COINS.length) break;
    if (ALLOWED_COINS[i] > difference) {
      change.push(ALLOWED_COINS[i - 1]);
      difference -= ALLOWED_COINS[i - 1];
      i = 0;
    } else i++;
  }
  return change;
};
