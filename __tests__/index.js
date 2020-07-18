const supertest = require("supertest");
const server = require("../index");
const db = require("../database/dbConfig");

afterAll(async () => {
  // closes the database connection so the jest command doesn't stall
  await db.destroy();
});

describe("the auth register endpoint", function () {
  beforeEach(async () => {
    await db("users").truncate();
  }); // end truncate db

  it("should return a status 201", function () {
    return supertest(server)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({ username: "thanos", password: "marvel" })
      .expect(201);
  });
  it("should return an object with message property", function () {
    return supertest(server)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({ username: "thanos", password: "marvel" })
      .then((res) => {
        expect(res.body).toHaveProperty("message");
      });
  });
}); //end register endpoint

describe("the auth login endpoint", function () {
  it("should return a status 200", function () {
    return supertest(server)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ username: "thanos", password: "marvel" })
      .expect(200);
  });

  it("should return an object with a  token property", function () {
    return supertest(server)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ username: "thanos", password: "marvel" })
      .then((res) => {
        expect(res.body).toHaveProperty("token");
      });
  });
});

describe("the jokes-router", function () {
  beforeEach(async () => {
    await db("users").truncate();
  }); // end truncate db

  it("should return a status 200", function () {
    //register first
    return supertest(server)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({ username: "thanos", password: "marvel" })
      .then((res) => {
        return res;
      })
      .then((res) => {
        //log in first to get a token
        return supertest(server)
          .post("/api/auth/login")
          .set("Content-Type", "application/json")
          .send({ username: "thanos", password: "marvel" })
          .then((res) => {
            return res.body.token;
          })
          .then((token) => {
            return supertest(server)
              .get("/api/jokes")
              .set("Content-Type", "application/json")
              .set("Authorization", token)
              .expect(200);
          });
      });
  });
  it("should return an object with a joke property", function () {
    //register first
    return supertest(server)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .send({ username: "thanos", password: "marvel" })
      .then((res) => {
        return res;
      })
      .then((res) => {
        //log in first to get a token
        return supertest(server)
          .post("/api/auth/login")
          .set("Content-Type", "application/json")
          .send({ username: "thanos", password: "marvel" })
          .then((res) => {
            return res.body.token;
          })
          .then((token) => {
            return supertest(server)
              .get("/api/jokes")
              .set("Content-Type", "application/json")
              .set("Authorization", token)
              .then((res) => {
                expect(res.body[0]).toHaveProperty("joke");
              });
          });
      });
  });
});
