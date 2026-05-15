import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { authMiddleware } from "../../../StretRace/src/application/middlewares/authMiddleware";
import {
  validateChallengeActionWithNotification,
  validateChallengeCreate,
  validateChallengeReport,
  validateIdBody,
  validateResolveChallengeDisputed,
} from "../../../StretRace/src/application/middlewares/validationMiddleware";

describe("challenge flow (integration)", () => {
  const app = express();
  app.use(express.json());

  const mockHandler = (_req: express.Request, res: express.Response) =>
    res.status(200).json({ ok: true });

  app.post("/challenges/createChallenge", authMiddleware, validateChallengeCreate, mockHandler);
  app.patch("/challenges/acceptChallenge", authMiddleware, validateChallengeActionWithNotification, mockHandler);
  app.patch("/challenges/rejectChallenge", authMiddleware, validateChallengeActionWithNotification, mockHandler);
  app.patch("/challenges/startChallenge", authMiddleware, validateIdBody, mockHandler);
  app.patch("/challenges/cancelChallenge", authMiddleware, validateIdBody, mockHandler);
  app.patch("/challenges/reporteChallenge", authMiddleware, validateChallengeReport, mockHandler);
  app.post("/challenges/resolveChallengeDisputed", authMiddleware, validateResolveChallengeDisputed, mockHandler);

  const bearer = () => {
    process.env.JWT_SECRET = "integration_secret";
    const t = jwt.sign(
      { userId: "11111111-1111-4111-8111-111111111111", userName: "Jose", role: "piloto" },
      process.env.JWT_SECRET!,
    );
    return `Bearer ${t}`;
  };

  const baseChallenge = {
    retador_id: "11111111-1111-4111-8111-111111111111",
    retado_id: "22222222-2222-4222-8222-222222222222",
    tipo_carrera: "cuarto_milla",
    vehiculo_retador_id: "33333333-3333-4333-8333-333333333333",
    vehiculo_retado_id: "44444444-4444-4444-8444-444444444444",
    ubicacion_acordada: "Autodromo X",
    fecha_acordada: "2026-05-10T15:00:00.000Z",
  };

  const baseNotification = {
    user_id: "22222222-2222-4222-8222-222222222222",
    tipo: "reto_recibido",
    leida: false,
    referencia_id: "55555555-5555-4555-8555-555555555555",
  };

  it("createChallenge: 401 sin token", async () => {
    const res = await request(app).post("/challenges/createChallenge").send({});
    expect(res.status).toBe(401);
  });

  it("createChallenge: 400 body invalido", async () => {
    const res = await request(app)
      .post("/challenges/createChallenge")
      .set("Authorization", bearer())
      .send({ challenge: {}, notification: {} });
    expect(res.status).toBe(400);
  });

  it("createChallenge: 200 body valido", async () => {
    const res = await request(app)
      .post("/challenges/createChallenge")
      .set("Authorization", bearer())
      .send({ challenge: baseChallenge, notification: baseNotification });
    expect(res.status).toBe(200);
  });

  it("accept/reject: 400 con id invalido y 200 con payload valido", async () => {
    const bad = await request(app)
      .patch("/challenges/acceptChallenge")
      .set("Authorization", bearer())
      .send({ id: "x", id_retado: "y", notification: {} });
    expect(bad.status).toBe(400);

    const ok = await request(app)
      .patch("/challenges/rejectChallenge")
      .set("Authorization", bearer())
      .send({
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        id_retado: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        notification: baseNotification,
      });
    expect(ok.status).toBe(200);
  });

  it("start/cancel: valida id", async () => {
    const bad = await request(app)
      .patch("/challenges/startChallenge")
      .set("Authorization", bearer())
      .send({ id: "123" });
    expect(bad.status).toBe(400);

    const ok = await request(app)
      .patch("/challenges/cancelChallenge")
      .set("Authorization", bearer())
      .send({ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" });
    expect(ok.status).toBe(200);
  });

  it("reporteChallenge: valida payload", async () => {
    const bad = await request(app)
      .patch("/challenges/reporteChallenge")
      .set("Authorization", bearer())
      .send({ id: "x" });
    expect(bad.status).toBe(400);

    const ok = await request(app)
      .patch("/challenges/reporteChallenge")
      .set("Authorization", bearer())
      .send({
        id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        id_ganador: "11111111-1111-4111-8111-111111111111",
        notas: "Gano por 2 autos",
        notification: [
          { ...baseNotification, user_id: "11111111-1111-4111-8111-111111111111", tipo: "resultado" },
          { ...baseNotification, user_id: "22222222-2222-4222-8222-222222222222", tipo: "resultado" },
        ],
      });
    expect(ok.status).toBe(200);
  });

  it("resolveChallengeDisputed: valida id y ganador_id", async () => {
    const bad = await request(app)
      .post("/challenges/resolveChallengeDisputed")
      .set("Authorization", bearer())
      .send({ id: "x", ganador_id: "y" });
    expect(bad.status).toBe(400);

    const ok = await request(app)
      .post("/challenges/resolveChallengeDisputed")
      .set("Authorization", bearer())
      .send({
        id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        ganador_id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      });
    expect(ok.status).toBe(200);
  });
});
