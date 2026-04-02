import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Belajar Vibe Coding API",
          version: "1.0.0",
          description: "API documentation for Belajar Vibe Coding project",
        },
        tags: [{ name: "Users", description: "User management endpoints" }],
      },
    })
  )
  .get("/", () => ({
    status: "ok",
    message: "Welcome to Elysia + Bun + Drizzle + MySQL",
  }))
  .use(usersRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
