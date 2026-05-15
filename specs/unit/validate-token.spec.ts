import { Request, Response } from "express";
import *as jwt from "jsonwebtoken";
import { authMiddleware } from "../../../StretRace/src/application/middlewares/authMiddleware";

jest.mock("jsonwebtoken");


describe("authMiddleware (unit)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("retorna 401 si no existe authorization header", () => {
    const req = {
      headers: {}
    } as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const res = {
      status
    } as unknown as Response;

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      error: "no existe el token"
    });

    expect(next).not.toHaveBeenCalled();
  });


  it("retorna 401 si el formato del token es inválido", () => {
    const req = {
      headers: {
        authorization: "token-mal-formado"
      }
    } as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const res = {
      status
    } as unknown as Response;

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      error: "formato no valido"
    });

    expect(next).not.toHaveBeenCalled();
  });


  it("retorna 401 si token es inválido", () => {

    const req = {
      headers: {
        authorization: "Bearer token-falso"
      }
    } as Request;

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const res = {
      status
    } as unknown as Response;

    const next = jest.fn();

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      error: "Invalid token"
    });

    expect(next).not.toHaveBeenCalled();
  });


  it("llama next si token es válido", () => {
    const req: any = {
      headers: {
        authorization: "Bearer token-valido"
      },
      user: undefined
    };

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    const res = {
      status
    } as unknown as Response;

    const next = jest.fn();

    (jwt.verify as jest.Mock).mockReturnValue({
      id: "123",
      role: "user"
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "token-valido",
      "test-secret"
    );

    expect(req.user).toEqual({
      id: "123",
      role: "user"
    });

    expect(next).toHaveBeenCalled();
  });

});