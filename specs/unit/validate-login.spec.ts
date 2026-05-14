import { Request, Response } from "express";
import { validateLogin } from "../../../StretRace/src/application/middlewares/validationMiddleware";

describe("validateLogin (unit)", () => {
  it("retorna 400 si email no es valido", () => {
    const req = { body: { email: "invalido", password: "123456" } } as Request;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    const next = jest.fn();

    validateLogin(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 400 si password es corta", () => {
    const req = { body: { email: "test@gmail.com", password: "123" } } as Request;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    const next = jest.fn();

    validateLogin(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("llama next con payload valido", () => {
    const req = { body: { email: "test@gmail.com", password: "123456" } } as Request;
    const res = {} as Response;
    const next = jest.fn();

    validateLogin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
