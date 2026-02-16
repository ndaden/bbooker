import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { swaggerConfig } from "./configuration";
import { ElysiaSwaggerConfig } from "@elysiajs/swagger/dist/types";
import { jwt } from "@elysiajs/jwt";
import { authentification } from "./modules/authentication";
import { business } from "./modules/business";
import { appointment } from "./modules/appointment";
import { userManagement } from "./modules/userManagement";
import { isMaintenance } from "./middlewares/maintenance";
// import { rateLimit } from "./middlewares/rateLimit";
import { buildApiResponse } from "./utils/api";
import { errorHandler } from "./utils/errorHandler";
import { logger } from "./utils/logger";
import { requestLogger } from "./middlewares/requestLogger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrompt } from "./utils/ai/prompts";
import { isAuthenticated } from "./middlewares/authentication";

const genAI = new GoogleGenerativeAI(Bun.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: Bun.env.AI_SYSTEM_INSTRUCTION })

// CORS Configuration - Load from environment variables
const ALLOWED_ORIGINS = (Bun.env.CORS_ORIGINS || 'http://localhost:3001,http://127.0.0.1:3001').split(',').map(origin => origin.trim());

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
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
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
 // .use(rateLimit())
  .use(requestLogger)
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
  .use(userManagement)
  .use(isAuthenticated)
  .get(
    "/ai",
    async ({ account }) => {
      // Only authenticated users can access AI endpoint
      if (!account) {
        return buildApiResponse(false, "Unauthorized - Authentication required");
      }
      
      try {
        const result = await model.generateContent(generatePrompt({ city: 'Bordeaux', services: 'coupe et coloriage des cheveux, manucure, pédicure', openingClosingDaysAndTimes: 'du lundi au vendredi de 10h à 18h' }));
        const response = await result.response;
        const text = response.text();

        // Safely parse JSON with error handling
        let json;
        try {
          json = JSON.parse(text);
        } catch (parseError) {
          logger.error("AI response JSON parse error", parseError instanceof Error ? parseError : new Error(String(parseError)));
          return buildApiResponse(false, "Invalid response format from AI service");
        }
        
        return buildApiResponse(true, "AI response", json);
      } catch (error) {
        logger.error("AI generation error", error instanceof Error ? error : new Error(String(error)));
        return buildApiResponse(false, "Error generating AI content");
      }
    },
    { detail: { tags: ["app"] } }
  )
  .listen(3002, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
