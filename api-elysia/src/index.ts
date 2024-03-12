import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { swaggerConfig } from "./configuration";
import { ElysiaSwaggerConfig } from "@elysiajs/swagger/dist/types";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { authentification } from "./modules/authentication";
import { business } from "./modules/business";
import { appointment } from "./modules/appointment";
import { isMaintenance } from "./middlewares/maintenance";
import { buildApiResponse } from "./utils/api";
import { cors } from "@elysiajs/cors"


const app: Elysia = new Elysia()
  .use(cors())
  .use(isMaintenance)
  .onError(({ error }) => {
    console.log(error)
    return buildApiResponse(false, "An error occured, please contact admin.")
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
  .use(appointment)
  .get("/", () => "Welcome to BBooker.", { detail: { tags: ["app"]}})
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
