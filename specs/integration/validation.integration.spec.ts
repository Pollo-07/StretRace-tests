import express from "express";
import request from "supertest";
import {
  validateChallengeCreate,
  validateIdBody,
} from "../../../StretRace/src/application/middlewares/validationMiddleware";

describe("validation middlewares (integration)", () => {
  const app = express();
  app.use(express.json());

  app.post("/challenge", validateChallengeCreate, (_req, res) => {
    res.status(201).json({ ok: true });
  });

  app.patch("/challenge/start", validateIdBody, (_req, res) => {
    res.status(200).json({ ok: true });
  });

  it("POST /challenge retorna 400 con body invalido", async () => {
    const res = await request(app).post("/challenge").send({});
    expect(res.status).toBe(400);
  });

  it("POST /challenge retorna 201 con body valido", async () => {
    const res = await request(app).post("/challenge").send({
      challenge: {
        retador_id: "11111111-1111-4111-8111-111111111111",
        retado_id: "22222222-2222-4222-8222-222222222222",
        tipo_carrera: "cuarto_milla",
        vehiculo_retador_id: "33333333-3333-4333-8333-333333333333",
        vehiculo_retado_id: "44444444-4444-4444-8444-444444444444",
        ubicacion_acordada: "Autodromo X",
        fecha_acordada: "2026-05-10T15:00:00.000Z"
      },
      notification: {
        user_id: "22222222-2222-4222-8222-222222222222",
        tipo: "reto_recibido",
        leida: false,
        referencia_id: "55555555-5555-4555-8555-555555555555"
      }
    });
    expect(res.status).toBe(201);
  });

  it("PATCH /challenge/start retorna 400 sin id valido", async () => {
    const res = await request(app).patch("/challenge/start").send({ id: "x" });
    expect(res.status).toBe(400);
  });

  it("PATCH /challenge/start retorna 200 con id valido", async () => {
    const res = await request(app)
      .patch("/challenge/start")
      .send({ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" });
    expect(res.status).toBe(200);
  });
});
