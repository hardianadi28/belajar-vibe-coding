import { Elysia, t } from "elysia";
import * as userService from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "",
  async ({ body, set }) => {
    try {
      const newUser = await userService.registerUser(body);
      set.status = 201;
      return {
        status: 201,
        message: "user created successfully",
        data: newUser,
      };
    } catch (error: any) {
      set.status = 400;
      return {
        status: 400,
        message: error.message || "Something went wrong",
        data: null,
      };
    }
  },
  {
    body: t.Object({
      name: t.String({ maxLength: 255 }),
      email: t.String({ format: "email", maxLength: 255 }),
      password: t.String({ maxLength: 255 }),
    }),
  }
)
.post(
  "/login",
  async ({ body, set }) => {
    try {
      const loginData = await userService.loginUser(body);
      set.status = 200;
      return {
        status: 200,
        message: "user logged in successfully",
        data: loginData,
      };
    } catch (error: any) {
      set.status = 400;
      return {
        status: 400,
        message: error.message || "Something went wrong",
        data: null,
      };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email", maxLength: 255 }),
      password: t.String({ maxLength: 255 }),
    }),
  }
)
.delete(
  "/logout",
  async ({ headers, set }) => {
    try {
      const authHeader = headers["authorization"];
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;

      await userService.logoutUser(token);

      set.status = 200;
      return {
        status: 200,
        message: "user logged out successfully",
        data: null,
      };
    } catch (error: any) {
      set.status = 400;
      return {
        status: 400,
        message: error.message || "Something went wrong",
        data: null,
      };
    }
  },
  {
    headers: t.Object({
      authorization: t.Optional(t.String()),
    }),
  }
);
