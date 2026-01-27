import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { swaggerConfig } from "./configuration";
import { ElysiaSwaggerConfig } from "@elysiajs/swagger/dist/types";
import { jwt } from "@elysiajs/jwt";
import { authentification } from "./modules/authentication";
import { business } from "./modules/business";
import { appointment } from "./modules/appointment";
import { isMaintenance } from "./middlewares/maintenance";
import { rateLimit } from "./middlewares/rateLimit";
import { buildApiResponse } from "./utils/api";
import { errorHandler } from "./utils/errorHandler";
import { cors } from "@elysiajs/cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrompt } from "./utils/ai/prompts";

const genAI = new GoogleGenerativeAI(Bun.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: Bun.env.AI_SYSTEM_INSTRUCTION })

const app: Elysia = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .use(swagger(swaggerConfig as ElysiaSwaggerConfig))
  .onBeforeHandle(({ set, request }) => {
    const origin = request.headers.get('origin');
    if (origin === 'http://localhost:3001' || origin === 'http://127.0.0.1:3001') {
      set.headers['Access-Control-Allow-Origin'] = origin;
      set.headers['Access-Control-Allow-Credentials'] = 'true';
      set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
      set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Cookie';
      set.headers['Access-Control-Expose-Headers'] = 'Set-Cookie';
    }
  })
  .options('*', ({ set }) => {
    set.status = 204;
    return '';
  })
  .use(rateLimit())
  .use(isMaintenance)
  .use(errorHandler)
  .get(
    "/",
    () => {
      return "Welcome to BBooker";
    },
    { detail: { tags: ["app"] } }
  )
  .use(authentification)
  .use(business)
  .use(appointment)
  .get(
    "/ai",
    async () => {
      const result = await model.generateContent(generatePrompt({ city: 'Bordeaux', services: 'coupe et coloriage des cheveux, manucure, pédicure', openingClosingDaysAndTimes: 'du lundi au vendredi de 10h à 18h' }));
      const response = await result.response;
      const text = response.text();

      const json = JSON.parse(text);
      return json;
    },
    { detail: { tags: ["app"] } }
  )
  .listen(3002, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
