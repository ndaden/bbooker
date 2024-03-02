import { Elysia } from "elysia";
import { prisma } from "../libs/prisma";
import { buildApiResponse } from "../utils/api";

export const isAuthenticated = (app: Elysia) =>
  app.derive(async ({ cookie, jwt, set }) => {
    if (!cookie!.access_token) {
      set.status = 401;
      return { error: buildApiResponse(false, "Unauthorized")};
    }
    const { accountId } = await jwt.verify(cookie!.access_token);
    if (!accountId) {
      set.status = 401;
      return { error: buildApiResponse(false, "Unauthorized")};
    }

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });
    if (!account) {
      set.status = 401;
      return { error: buildApiResponse(false, "Unauthorized")};
    }
    return {
      account,
    };
  });