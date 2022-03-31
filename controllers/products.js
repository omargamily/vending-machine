import Product from "../models/products";

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
