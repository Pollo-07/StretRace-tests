import express from "express";
import request from "supertest";
import { authMiddleware } from "../../../StretRace/src/application/middlewares/authMiddleware";
import jwt from "jsonwebtoken";

describe("authMiddleware (integration)", () => {
  const app = express();
  app.use(express.json());
  app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({ ok: true, userId: (req as any).user?.userId });
  });

  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";
  });

  it("retorna 401 sin Authorization", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
  });

  it("retorna 401 con formato invalido", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Token abc");
    expect(res.status).toBe(401);
  });

  it("retorna 200 con token valido", async () => {
    const token = jwt.sign({ userId: "u1", userName: "Jose", role: "piloto" }, process.env.JWT_SECRET!);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.userId).toBe("u1");
  });
});
