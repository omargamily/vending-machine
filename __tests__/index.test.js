import request from "supertest";
import app from "../app";
import { usersTest } from "./users.test";
import { productsTest } from "./products.test";

describe("/user/", () => usersTest(request, app));
describe("/product/", () => productsTest(request, app));

export const buyerCredentials = {
  username: "buyer1",
  password: "123456789",
};
export const seller1Credentials = {
  username: "seller1",
  password: "123456789",
};
export const seller2Credentials = {
  username: "seller2",
  password: "123456789",
};

export const p1Id = "62462a637cfb089f20eaee77";
export const p2Id = "62462a637cfb089f20eaee76";

export const getToken = async (username, password) => {
  const singinRes = await request(app)
    .post("/api/user/signin")
    .send({ username: username, password: password });
  return singinRes.body.token;
};
