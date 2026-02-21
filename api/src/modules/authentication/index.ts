import { Elysia, t } from "elysia";
import { comparePassword, hashPassword } from "../../utils/crypto";
import { prisma } from "../../libs/prisma";
import { accountBodyType, loginBodyType, patchAccountBodyType } from "./types";
import { buildApiResponse } from "../../utils/api";
import { isAuthenticated } from "../../middlewares/authentication";
import { uploadImageToR2, deleteImageFromR2 } from "../../utils/upload";
import { getErrorMessage } from "../../utils/errors";
import { logger } from "../../utils/logger";
// import { authRateLimit } from "../../middlewares/authRateLimit";

export const authentification = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      // .use(authRateLimit())
      .post(
        "/signup",
        async ({ body, set }) => {
          const { email, password, passwordAgain, accountType } = body;
          try {
          if (password === passwordAgain) {
            const { hash } = await hashPassword(password);
            const newAccount = await prisma.account.create({
              data: {
                email,
                hash,
                role: accountType || "STANDARD",
              },
              select: {
                id: true,
                email: true,
                role: true
              }
            });
          
            set.status = "Created";
            return buildApiResponse(
              true,
              "account successfully create",
              newAccount
            );
          } else {
            set.status = "Bad Request";
            return buildApiResponse(false, "Passwords don't match");
          }
        } catch (error: any) {
          // Log full error details for debugging
          logger.error('Signup error', error instanceof Error ? error : new Error(String(error)), {
            code: error.code,
            message: error.message,
            meta: error.meta,
          });
          set.status = "Bad Request"; 
          return buildApiResponse(false, getErrorMessage(error.code));
        }
        },
        {
          body: accountBodyType,
          detail: { tags: ["auth"] },
        }
      )
      .post(
        "/login",
        async ({ body, jwt, set, cookie: { access_token } }) => {
          const { email, password } = body;
          const account = await prisma.account.findFirst({
            where: {
              email,
            },
            select: {
              id: true,
              hash: true,
            },
          });

          if (!account) {
            set.status = 401;
            return buildApiResponse(false, "wrong email or password");
          }
          // check password
          const match = await comparePassword(password, account.hash);

          if (!match) {
            set.status = 401;
            return buildApiResponse(false, "wrong email or password");
          }

          // login OK!
          const accessToken = await jwt.sign({
            accountId: account.id,
          });

          access_token.value = accessToken;
          access_token.domain = process.env.COOKIE_DOMAIN;
          access_token.maxAge = 15 * 60;
          access_token.secure = Bun.env.NODE_ENV === 'production';
          access_token.sameSite = Bun.env.NODE_ENV === 'production' ? "strict" : "lax";
          access_token.httpOnly = true;
          access_token.path = "/";

          return buildApiResponse(true, "login successful.");
        },
        { body: loginBodyType, detail: { tags: ["auth"] } }
      )
      .get(
        "/logout",
        ({ cookie: { access_token } }) => {
          // access_token.remove() is not working, so we use a workaround
          access_token.set({
            path: "/",
            domain: process.env.COOKIE_DOMAIN,
            maxAge: 0,
            value: "",
          });

          return buildApiResponse(true, "logout successful.");
        },
        { detail: { tags: ["auth"] } }
      )
      .use(isAuthenticated)
      .get(
        "/profile",
        ({ account, error }) => {
          if (account) {
            return buildApiResponse(true, "profile", account);
          }
          return error;
        },
        { detail: { tags: ["auth"] } }
      )
      .patch(
        "/profile",
        async ({ account, error, set, body }) => {
            if (!account) {
              return error;
            }

          let profileToUpdateOrCreate: any = {};
          let accountToUpdate: any = {};

          try {
            const id = body['id'];
            const profileStr = body['profile'];
            const profileImage = body['profileImage'] as File | undefined;
            const email = body['email'];
            const password = body['password'];
            const newPassword = body['newPassword'];
            const newPasswordAgain = body['newPasswordAgain'];
            const active = body['active'];
            const role = body['role'];
            const profile = profileStr ? JSON.parse(profileStr?.toString() || '') : undefined;

            // only admin can update another account
            const idToUpdate = account.role === "ADMIN" ? id : account.id;

            if (email) {
              accountToUpdate.email = email;
            }

            if (profileImage) {
              // Delete old profile image if it exists
              const currentAccount = await prisma.account.findFirst({
                where: { id: idToUpdate },
                include: { profile: true }
              });

              if (currentAccount?.profile?.profileImage) {
                await deleteImageFromR2(currentAccount.profile.profileImage);
              }

              const uploadResult = await uploadImageToR2(profileImage, account.id, 'profile-image');

              if (!uploadResult.success) {
                set.status = "Bad Request";
                return buildApiResponse(false, uploadResult.error ?? "");
              }

              const profileImageUrl = uploadResult.url ?? "";
              profileToUpdateOrCreate.profileImage = profileImageUrl;
            }

            if (profile) {
              const { firstName, lastName, address, phoneNumber } = profile;
              profileToUpdateOrCreate.firstName = firstName;
              profileToUpdateOrCreate.lastName = lastName;
              profileToUpdateOrCreate.address = address;
              profileToUpdateOrCreate.phoneNumber = phoneNumber;
            }

            if (password && newPassword && newPasswordAgain) {
              if (newPassword !== newPasswordAgain) {
                set.status = 401;
                return buildApiResponse(false, "passwords don't match");
              }

              // check password
              const match = await comparePassword(password, account.hash);

              if (!match) {
                set.status = 401;
                return buildApiResponse(false, "wrong password");
              }

              const { hash } = await hashPassword(newPassword);
              // update password in database
              accountToUpdate.hash = hash;
            }

            let fieldsToUpdateByAdmin;

            if (account.role === "ADMIN") {
              fieldsToUpdateByAdmin = {
                active: active === 'true',
                role,
              };
            }

            const updatedAccount = await prisma.account.update({
              where: {
                id: idToUpdate,
              },
              data: {
                ...accountToUpdate,
                ...fieldsToUpdateByAdmin,
                profile: account.profile
                  ? { update: profileToUpdateOrCreate }
                  : { create: profileToUpdateOrCreate },
                updateDate: new Date(),
              },
              include: { profile: true },
            });

            return buildApiResponse(true, "account updated", updatedAccount);
          } catch (error: any) {
            logger.error('Profile update error', error instanceof Error ? error : new Error(String(error)), {
              code: error.code,
              message: error.message,
              meta: error.meta,
            });
            set.status = 500;
            return buildApiResponse(false, getErrorMessage(error.code) || 'Update failed');
          }
        },
        {
          body: t.Any(),
          detail: { tags: ["auth"] }
        }
      )
      .delete(
        "/profile/image",
        async ({ account, error, set }) => {
          if (!account) {
            return error;
          }

          try {
            const currentAccount = await prisma.account.findFirst({
              where: { id: account.id },
              include: { profile: true }
            });

            if (!currentAccount?.profile?.profileImage) {
              set.status = "Bad Request";
              return buildApiResponse(false, "No profile image to delete");
            }

            // Delete image from R2
            const deleteResult = await deleteImageFromR2(currentAccount.profile.profileImage);

            if (!deleteResult.success) {
              set.status = "Bad Request";
              return buildApiResponse(false, deleteResult.error ?? "Failed to delete image");
            }

            // Remove image URL from database
            await prisma.account.update({
              where: { id: account.id },
              data: {
                profile: {
                  update: {
                    profileImage: null
                  }
                },
                updateDate: new Date()
              }
            });

            return buildApiResponse(true, "Profile image deleted successfully");
          } catch (error: any) {
            logger.error('Profile image delete error', error instanceof Error ? error : new Error(String(error)), {
              code: error.code,
              message: error.message,
              meta: error.meta,
            });
            set.status = 500;
            return buildApiResponse(false, getErrorMessage(error.code) || 'Delete failed');
          }
        },
        { 
          body: t.Object({}),
          detail: { tags: ["auth"] } 
        }
      )
  );
