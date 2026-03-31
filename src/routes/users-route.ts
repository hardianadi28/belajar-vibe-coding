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
      name: t.String(),
      email: t.String(),
      password: t.String(),
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
      email: t.String(),
      password: t.String(),
    }),
  }
);
