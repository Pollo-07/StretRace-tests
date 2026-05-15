import jwt from "jsonwebtoken";
import token from "../../../StretRace/src/utils/token";

describe("token utils (unit)", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "unit_secret";
    process.env.JWT_REFRESH_SECRET = "unit_refresh_secret";
  });

  it("generateToken crea access token valido", () => {
    const access = token.generateToken("user-1", "Jose", "user");
    const payload = jwt.verify(access, process.env.JWT_SECRET!) as any;

    expect(payload.userId).toBe("user-1");
    expect(payload.userName).toBe("Jose");
    expect(payload.role).toBe("user");
  });

  it("refreshToken crea refresh token valido", () => {
    const refresh = token.refreshToken("user-2", "admin");
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET!) as any;

    expect(payload.userId).toBe("user-2");
    expect(payload.role).toBe("admin");
  });
});
