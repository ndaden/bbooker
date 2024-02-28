import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { PrismaClient } from '@prisma/client' 

const db = new PrismaClient()

const app = new Elysia()
  .use(
    swagger({
      provider: "swagger-ui",
    })
  )
  .get("/", () => "Hello Elysia")
  .post('/sign-up', async ({ body }) => db.user.create({ data: body })
  , {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      name: t.String()
    })
  })
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
