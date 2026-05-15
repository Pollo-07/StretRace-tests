
import express from "express";
import request from "supertest";
import {validateChallengeActionWithNotification} from "../../../StretRace/src/application/middlewares/validationMiddleware";

const app = express();
app.use(express.json());

app.patch(
  "/challenge/acceptChallenge",
  validateChallengeActionWithNotification,
  (_req, res) => {
    res.status(200).json({ ok: true });
  }
);

describe("accept challenge integration", () => {

  it("PATCH /challenge/acceptChallenge retorna 200 si body valido", async () => {
    const res = await request(app)
      .patch("/challenge/acceptChallenge")
      .send({
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        id_retado: "22222222-2222-4222-8222-222222222222",
        notification: {
          user_id: "11111111-1111-4111-8111-111111111111",
          tipo: "reto_aceptado",
          leida: false,
          referencia_id: "55555555-5555-4555-8555-555555555555"
        }
      });

    expect(res.status).toBe(200);
  });

  it("retorna 400 si body invalido", async () => {
    const res = await request(app)
      .patch("/challenge/acceptChallenge")
      .send({});

    expect(res.status).toBe(400);
  });

});