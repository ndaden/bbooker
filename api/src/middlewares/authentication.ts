import { Elysia } from "elysia";
import { prisma } from "../libs/prisma";
import { buildApiResponse } from "../utils/api";

export const isAuthenticated = (app: Elysia) =>
  app.derive(async ({ cookie: { access_token }, jwt, set }) => {
    if (!access_token.value) {
      set.status = 401;
      return { error: buildApiResponse(false, "Unauthorized") };
    }
    const { accountId } = await jwt.verify(access_token.value);
    if (!accountId) {
      set.status = 401;
      return { error: buildApiResponse(false, "Unauthorized") };
    }

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        profile: true,
      },
    });

    if (!account) {
      set.status = 401;
      return { error: buildApiResponse(false, "Unauthorized") };
    }

    // Check if account is active
    if (!account.active) {
      set.status = 403;
      return { error: buildApiResponse(false, "Account is disabled. Please contact support.") };
    }

    const returnedAccount = Object.fromEntries(
      Object.entries(account).filter(([key]) => !["hash"].includes(key))
    );

    return {
      account: returnedAccount,
    };
  });
