import app from "../app";
import request from "supertest";

describe("create user", () => {
  it("should create a new user", async () => {
    const payload = {
      username: "omar",
      password: "123456789",
      role: "buyer",
    };
    const res = await request(app).post("/api/user").send(payload);
    const data = res.body;
    expect(res.statusCode).toBe(200);
    const { password, ...rest } = payload;
    expect(data).toMatchObject(rest);
  });
  it("missing data", async () => {
    const payload = {
      username: "omar",
      password: "",
      role: "buyer",
    };
    const res = await request(app).post("/api/user").send(payload);
    const data = res.body;
    expect(res.statusCode).toBe(400);
    expect(data.err).toBe("missing field");
  });
  it("duplicate user", async () => {
    const payload = {
      username: "omar",
      password: "123456789",
      role: "buyer",
    };
    const res = await request(app).post("/api/user").send(payload);
    const data = res.body;
    expect(res.statusCode).toBe(400);
    expect(data.err).toBe("duplicate username");
  });
});
describe("singin", () => {
  it("missing credentials", async () => {
    const res = await request(app)
      .post("/api/user/signin")
      .send({ username: "omar", password: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body.err).toBe("incorrect username or password");
  });
  it("incorrect credentials", async () => {
    const res = await request(app)
      .post("/api/user/signin")
      .send({ username: "omar", password: "12424124" });
    expect(res.statusCode).toBe(400);
    expect(res.body.err).toBe("incorrect username or password");
  });
  it("successful signin", async () => {
    const res = await request(app)
      .post("/api/user/signin")
      .send({ username: "omar", password: "123456789" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
describe("get user", () => {
  it("forbidden", async () => {
    const token = "";
    const res = await request(app)
      .get("/api/user/")
      .set("authorization", token);
    expect(res.statusCode).toBe(403);
  });
  it("get user data", async () => {
    const token = await getToken("omar", "123456789");
    const res = await request(app)
      .get("/api/user/")
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("username", "omar");
    expect(res.body.user).toHaveProperty("role", "buyer");
  });
});

describe("update usesr", () => {
  it("forbidden", async () => {
    const token = "";
    const res = await request(app)
      .put("/api/user/")
      .set("authorization", token);
    expect(res.statusCode).toBe(403);
  });
  it("update user role -> 400", async () => {
    const token = await getToken("omar", "123456789");
    const res = await request(app)
      .put("/api/user/")
      .set("authorization", token)
      .send({ key: "role", value: "buyer" });
    expect(res.statusCode).toBe(400);
    expect(res.body.err).toBe("Cant change user role");
  });
  it("update user deposit -> 400", async () => {
    const token = await getToken("omar", "123456789");
    const res = await request(app)
      .put("/api/user/")
      .set("authorization", token)
      .send({ key: "deposit", value: 100 });
    expect(res.statusCode).toBe(400);
    expect(res.body.err).toBe("Cant change user deposit");
  });
  it("update user password -> 200", async () => {
    const token = await getToken("omar", "123456789");
    const res = await request(app)
      .put("/api/user/")
      .set("authorization", token)
      .send({ key: "password", value: "1234567" });
    const newtoken = await getToken("omar", "1234567");
    expect(res.statusCode).toBe(200);
    expect(typeof newtoken).toBe("string");
  });
});

describe("delete user", () => {
  it("forbidden", async () => {
    const token = "";
    const res = await request(app)
      .get("/api/user/")
      .set("authorization", token);
    expect(res.statusCode).toBe(403);
  });
  it("delete user", async () => {
    const token = await getToken("omar", "1234567");
    const res = await request(app)
      .delete("/api/user/")
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
  });
});
const getToken = async (username, password) => {
  const singinRes = await request(app)
    .post("/api/user/signin")
    .send({ username: username, password: password });
  return singinRes.body.token;
};
