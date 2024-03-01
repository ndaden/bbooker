import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { swaggerConfig } from "./configuration";
import { ElysiaSwaggerConfig } from "@elysiajs/swagger/dist/types";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { authentification } from "./modules/authentication";
import { business } from "./modules/business";


const app: Elysia = new Elysia()
  .onError(({ error }) => {
    console.log(error)
    return "something went wrong"
  })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .use(cookie())
  .use(
    swagger(swaggerConfig as ElysiaSwaggerConfig)
  )
  .use(authentification)
  .use(business)
  .get("/", () => "Welcome to BBooker.", { detail: { tags: ["app"]}})
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
