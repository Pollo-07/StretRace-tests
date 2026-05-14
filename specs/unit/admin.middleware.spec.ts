import { Request, Response } from "express";
import { adminMiddleware } from "../../../StretRace/src/application/middlewares/adminMiddleware";

describe("adminMiddleware (unit)", () => {
  it("retorna 401 si no existe req.user", () => {
    const req = {} as Request;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 403 si role no es admin", () => {
    const req = { user: { role: "piloto" } } as unknown as Request;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ message: "Forbidden: Admins only" });
    expect(next).not.toHaveBeenCalled();
  });

  it("llama next si role es admin", () => {
    const req = { user: { role: "admin" } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
