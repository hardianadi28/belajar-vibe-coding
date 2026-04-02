import { describe, expect, it, mock } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "../src/routes/users-route";

// Mock the user service
const mockRegisterUser = mock();
const mockLoginUser = mock();
const mockLogoutUser = mock();

mock.module("../src/services/users-service", () => ({
  registerUser: mockRegisterUser,
  loginUser: mockLoginUser,
  logoutUser: mockLogoutUser,
}));

describe("Users Route", () => {
  const app = new Elysia().use(usersRoute);

  describe("POST /api/users (Register)", () => {
    it("should return 201 when registration is successful", async () => {
      const newUser = { id: 1, name: "Test User" };
      mockRegisterUser.mockResolvedValue(newUser);

      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toEqual({
        status: 201,
        message: "user created successfully",
        data: newUser,
      });
    });

    it("should return 400 when validation fails (invalid email)", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "invalid-email",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(422);
    });

    it("should return 400 when service throws an error", async () => {
      mockRegisterUser.mockRejectedValue(new Error("user already exists"));

      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = (await response.json()) as any;
      expect(body.message).toBe("user already exists");
    });
  });

  describe("POST /api/users/login", () => {
    it("should return 200 when login is successful", async () => {
      const loginData = { name: "Test User", token: "fake-token" };
      mockLoginUser.mockResolvedValue(loginData);

      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(200);
      const body = (await response.json()) as any;
      expect(body).toEqual({
        status: 200,
        message: "user logged in successfully",
        data: loginData,
      });
    });

    it("should return 422 when login validation fails", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "invalid-email",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(422);
    });

    it("should return 400 when service throws an error (e.g. wrong credentials)", async () => {
      mockLoginUser.mockRejectedValue(new Error("incorrect email or password combination"));

      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "wrongpassword",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = (await response.json()) as any;
      expect(body.message).toBe("incorrect email or password combination");
    });
  });

  describe("DELETE /api/users/logout", () => {
    it("should return 200 when logout is successful with Bearer token", async () => {
      mockLogoutUser.mockResolvedValue(true);

      const response = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer fake-token",
          },
        })
      );

      expect(response.status).toBe(200);
      const body = (await response.json()) as any;
      expect(body.message).toBe("user logged out successfully");
      expect(mockLogoutUser).toHaveBeenCalledWith("fake-token");
    });

    it("should return 200 when logout is successful with non-Bearer token (edge case check)", async () => {
      mockLogoutUser.mockResolvedValue(true);

      const response = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
          headers: {
            "Authorization": "other-token",
          },
        })
      );

      expect(response.status).toBe(200);
      // In this branch, token becomes undefined in users-route.ts
      expect(mockLogoutUser).toHaveBeenCalledWith(undefined);
    });

    it("should return 400 when service throws an error (e.g. not logged in)", async () => {
      mockLogoutUser.mockRejectedValue(new Error("user not logged in"));

      const response = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
        })
      );

      expect(response.status).toBe(400);
      const body = (await response.json()) as any;
      expect(body.message).toBe("user not logged in");
    });
  });
});
