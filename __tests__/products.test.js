import { getChange } from "../controllers/products";
import { getToken, p1Id, p2Id } from "./index.test";
import {
  seller1Credentials,
  seller2Credentials,
  buyerCredentials,
} from "./index.test";

export const productsTest = (request, app) => {
  describe("create products", () => {
    it("missing data --> 400", async () => {
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const payload = {
        productName: "coke",
        amountAvaliable: 10,
      };
      const res = await request(app)
        .post("/api/product/")
        .send(payload)
        .set("authorization", token);

      const data = res.body;
      expect(res.statusCode).toBe(400);
      expect(data.err).toBe("missing field");
    });

    it("not a seller --> 401", async () => {
      const token = await getToken(
        buyerCredentials.username,
        buyerCredentials.password
      );
      const payload = {
        productName: "coke",
        amountAvaliable: 10,
        cost: 50,
      };
      const res = await request(app)
        .post("/api/product/")
        .send(payload)
        .set("authorization", token);

      const data = res.body;
      expect(res.statusCode).toBe(401);
      expect(data.err).toBe("wrong role");
    });

    it("item created", async () => {
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const payload = {
        productName: "coke",
        amountAvaliable: 10,
        cost: 50,
      };
      const res = await request(app)
        .post("/api/product/")
        .send(payload)
        .set("authorization", token);

      const data = res.body;
      expect(res.statusCode).toBe(200);
      expect(data).toHaveProperty("productName", "coke");
      expect(data).toHaveProperty("amountAvaliable", 10);
    });
    it("item found", async () => {
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const payload = {
        productName: "coke",
        amountAvaliable: 10,
        cost: 50,
      };
      const res = await request(app)
        .post("/api/product/")
        .send(payload)
        .set("authorization", token);

      const data = res.body;
      expect(res.statusCode).toBe(400);
      expect(data.err).toBe("item with same name found");
    });
  });
  describe("get products", () => {
    it("get products --> 200", async () => {
      const res = await request(app).get("/api/product/");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("products");
      expect(res.body.products).toBeInstanceOf(Array);
    });
  });
  describe("update prodcut", () => {
    it("update product name --> 400", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]
      );
      const payload = {
        key: "productName",
        value: "new name",
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("can't change a product's productName");
    });
    it("update product sellerId --> 400", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]
      );
      const payload = {
        key: "sellerId",
        value: "newId",
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("can't change a product's sellerId");
    });
    it("update product unauthorized --> 401", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "cost",
        value: 100,
        productId: product,
      };
      const token = await getToken(
        seller2Credentials.username,
        seller2Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);
      expect(res.statusCode).toBe(401);
      expect(res.body.err).toBe("unauthorized");
    });
    it("missing parameter", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "cost",
        productId: product,
      };
      const token = await getToken(
        seller2Credentials.username,
        seller2Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("missing parameter");
    });
    it("item not found", async () => {
      const payload = {
        key: "cost",
        value: 230,
        productId: "1231",
      };
      const token = await getToken(
        seller2Credentials.username,
        seller2Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(404);
      expect(res.body.err).toBe("product not found");
    });
    it("update product cost to be 0 --> 400", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "cost",
        value: 0,
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("product cost can't be 0");
    });
    it("update product cost to be -ve --> 400", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "cost",
        value: -10,
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("product cost can't be less than 0");
    });
    it("update product cost --> 200", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "cost",
        value: 20,
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id", payload.productId);
      expect(res.body).toHaveProperty("productName");
      expect(res.body).toHaveProperty("amountAvaliable");
      expect(res.body).toHaveProperty("cost", payload.value);
      expect(res.body).toHaveProperty("sellerId");
    });
    it("update product amount to be 0 --> 200", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "amountAvaliable",
        value: 0,
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("product amountAvaliable can't be 0");
    });
    it("update product amount to be -ve --> 200", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "amountAvaliable",
        value: -12,
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("product amountAvaliable can't be less than 0");
    });
    it("update product amount --> 200", async () => {
      const product = await getProduct(request, app).then(
        (result) => result[0]._id
      );
      const payload = {
        key: "amountAvaliable",
        value: 20,
        productId: product,
      };
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const res = await request(app)
        .put("/api/product/")
        .set("authorization", token)
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id", payload.productId);
      expect(res.body).toHaveProperty("productName");
      expect(res.body).toHaveProperty("amountAvaliable", payload.value);
      expect(res.body).toHaveProperty("cost");
      expect(res.body).toHaveProperty("sellerId");
    });
  });
  describe("delete products", () => {
    it("delete without id --> 400", async () => {
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );

      const res = await request(app)
        .delete("/api/product/?id=")
        .set("authorization", token);
      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("missing paramter");
    });
    it("delete with imaginary id --> 404", async () => {
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );

      const res = await request(app)
        .delete("/api/product/?id=123")
        .set("authorization", token);
      expect(res.statusCode).toBe(404);
      expect(res.body.err).toBe("product not found");
    });
    it("delete another seller product --> 401", async () => {
      const token = await getToken(
        seller2Credentials.username,
        seller2Credentials.password
      );
      // get product id
      const _id = await getProduct(request, app).then(
        (products) => products[0]._id
      );
      const res = await request(app)
        .delete(`/api/product/?id=${_id}`)
        .set("authorization", token);
      expect(res.statusCode).toBe(401);
      expect(res.body.err).toBe("unauthorized");
    });
    it("delete successfully --> 200", async () => {
      const token = await getToken(
        seller1Credentials.username,
        seller1Credentials.password
      );
      const _id = await getProduct(request, app).then(
        (products) => products[0]._id
      );
      const res = await request(app)
        .delete(`/api/product/?id=${_id}`)
        .set("authorization", token);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", _id);
    });
  });

  describe("buy", () => {
    const setDeposit = async (value, token) => {
      await request(app)
        .post("/api/user/deposit")
        .set("authorization", token)
        .send({ deposit: value });
    };
    const makeRequest = async (token, payload) => {
      const res = await request(app)
        .post("/api/product/buy")
        .set("authorization", token)
        .send(payload);
      return res;
    };
    const getBuyerToken = async () => {
      const token = await getToken(
        buyerCredentials.username,
        buyerCredentials.password
      );
      return token;
    };

    it("buy with 0 quantity --> 400", async () => {
      const token = await getBuyerToken();
      const payload = {
        productId: p1Id,
        quantity: 0,
      };
      const res = await makeRequest(token, payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("quantity must be > 0");
    });
    it("buy with float quantity --> 400", async () => {
      const token = await getBuyerToken();
      const payload = {
        productId: p1Id,
        quantity: 1.5,
      };
      const res = await makeRequest(token, payload);
      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("quantity must be a whole number");
    });
    it("buy with quantity > amountAvaliable --> 400", async () => {
      const token = await getBuyerToken();
      const payload = {
        productId: p1Id,
        quantity: 100,
      };
      const res = await makeRequest(token, payload);
      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("no enough products to satisfy this amount");
    });
    it("buy with an imaginary product --> 404", async () => {
      const token = await getBuyerToken();
      const payload = {
        productId: "123124",
        quantity: 1,
      };
      const res = await makeRequest(token, payload);
      expect(res.statusCode).toBe(404);
      expect(res.body.err).toBe("product not found");
    });
    it("buy with no productId --> 400", async () => {
      const token = await getBuyerToken();
      const payload = {
        quantity: 1,
      };
      const res = await makeRequest(token, payload);
      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("missing parameter");
    });
    it("products cost more than deposit --> 400 ", async () => {
      const token = await getBuyerToken();
      await setDeposit(10, token);
      const payload = {
        productId: p1Id,
        quantity: 10,
      };
      const res = await makeRequest(token, payload);
      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("not enough deposit");
    });
    it("buy a single product successfuly --> 200", async () => {
      const token = await getBuyerToken();
      const payload = {
        productId: p1Id,
        quantity: 1,
      };
      await setDeposit(25, token);
      const res = await makeRequest(token, payload);
      const p1IdPrice = 5;
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("products", p1Id);
      expect(res.body).toHaveProperty("total", payload.quantity * p1IdPrice);
      expect(res.body).toHaveProperty("change");
    });
  });

  describe("get difference", () => {
    it("difference 5", () => {
      const difference = 5;
      const change = getChange(difference);
      expect(change).toContain(5);
    });
    it("difference 10", () => {
      const difference = 10;
      const change = getChange(difference);
      expect(change).toContain(10);
    });
    it("difference 15", () => {
      const difference = 15;
      const change = getChange(difference);
      expect(change).toContain(10);
      expect(change).toContain(5);
    });
    it("difference 25", () => {
      const difference = 25;
      const change = getChange(difference);
      expect(change).toContain(20);
      expect(change).toContain(5);
    });
    it("difference 35", () => {
      const difference = 35;
      const change = getChange(difference);
      expect(change).toContain(20);
      expect(change).toContain(10);
      expect(change).toContain(5);
    });
    it("difference 22", () => {
      const difference = 22;
      const change = getChange(difference);
      expect(change).toContain(20);
    });
  });
};

const getProduct = async (request, app) => {
  const res = await request(app).get("/api/product/");
  return res.body.products;
};
