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
    response: {
      201: t.Object({
        status: t.Number({ example: 201 }),
        message: t.String({ example: "user created successfully" }),
        data: t.Object({
          id: t.Number({ example: 1 }),
          name: t.String({ example: "John Doe" }),
        }),
      }),
      400: t.Object({
        status: t.Number({ example: 400 }),
        message: t.String({ example: "user already exists" }),
        data: t.Null(),
      })
    },
    detail: {
      tags: ["Users"],
      summary: "Register a new user",
      description: "Create a new user account with name, email, and password.",
    },
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
    response: {
      200: t.Object({
        status: t.Number({ example: 200 }),
        message: t.String({ example: "user logged in successfully" }),
        data: t.Object({
          name: t.String({ example: "John Doe" }),
          token: t.String({ example: "uuid-token" }),
        }),
      }),
      400: t.Object({
        status: t.Number({ example: 400 }),
        message: t.String({ example: "incorrect email or password combination" }),
        data: t.Null(),
      })
    },
    detail: {
      tags: ["Users"],
      summary: "User login",
      description: "Authenticate a user and return a session token.",
    },
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
    response: {
      200: t.Object({
        status: t.Number({ example: 200 }),
        message: t.String({ example: "user logged out successfully" }),
        data: t.Null(),
      }),
      400: t.Object({
        status: t.Number({ example: 400 }),
        message: t.String({ example: "user not logged in" }),
        data: t.Null(),
      })
    },
    detail: {
      tags: ["Users"],
      summary: "User logout",
      description: "Invalidate the current user session token.",
    },
  }
);
