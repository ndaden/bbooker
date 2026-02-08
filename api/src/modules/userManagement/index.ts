import { Elysia, t } from "elysia";
import { isAuthenticated } from "../../middlewares/authentication";
import { requireAdmin } from "../../middlewares/authorization";
import { prisma } from "../../libs/prisma";
import { buildApiResponse } from "../../utils/api";
import { getErrorMessage } from "../../utils/errors";
import { comparePassword, hashPassword } from "../../utils/crypto";

/**
 * User management module - ADMIN ONLY
 * All endpoints require admin role
 */
export const userManagement = (app: Elysia) =>
  app.group("/admin/users", (app) =>
    app
      .use(isAuthenticated)
      .use(requireAdmin)
      
      // List all users
      .get(
        "/",
        async () => {
          const users = await prisma.account.findMany({
            select: {
              id: true,
              email: true,
              role: true,
              active: true,
              createDate: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              _count: {
                select: {
                  appointment: true,
                },
              },
            },
            orderBy: {
              createDate: 'desc',
            },
          });

          return buildApiResponse(true, "users list", users);
        },
        { detail: { tags: ["admin"] } }
      )
      
      // Get specific user
      .get(
        "/:id",
        async ({ params, set }) => {
          const { id } = params;
          
          const user = await prisma.account.findUnique({
            where: { id },
            select: {
              id: true,
              email: true,
              role: true,
              active: true,
              createDate: true,
              updateDate: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  address: true,
                  phoneNumber: true,
                },
              },
              appointment: {
                select: {
                  id: true,
                  startTime: true,
                  endTime: true,
                  service: {
                    select: {
                      name: true,
                      business: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
                orderBy: {
                  startTime: 'desc',
                },
                take: 10,
              },
              business: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  createDate: true,
                  _count: {
                    select: {
                      services: true,
                    },
                  },
                },
              },
            },
          });

          if (!user) {
            set.status = 404;
            return buildApiResponse(false, "User not found");
          }

          return buildApiResponse(true, "user details", user);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: { tags: ["admin"] },
        }
      )
      
      // Update user
      .patch(
        "/:id",
        async ({ params, body, set }) => {
          const { id } = params;
          const { email, role, active, profile, password } = body as any;

          // Check if user exists
          const existingUser = await prisma.account.findUnique({
            where: { id },
            include: { profile: true },
          });

          if (!existingUser) {
            set.status = 404;
            return buildApiResponse(false, "User not found");
          }

          // Build update data
          const updateData: any = {};
          if (email) updateData.email = email;
          if (role) updateData.role = role;
          if (active !== undefined) updateData.active = active;
          if (password) {
            const { hash } = await hashPassword(password);
            updateData.hash = hash;
          }
          if (profile) {
            updateData.profile = existingUser.profile
              ? { update: profile }
              : { create: profile };
          }
          updateData.updateDate = new Date();

          const updatedUser = await prisma.account.update({
            where: { id },
            data: updateData,
            select: {
              id: true,
              email: true,
              role: true,
              active: true,
              profile: true,
              updateDate: true,
            },
          });

          return buildApiResponse(true, "user updated", updatedUser);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            email: t.Optional(t.String({ format: "email" })),
            role: t.Optional(t.Enum({ ADMIN: "ADMIN", OWNER: "OWNER", STANDARD: "STANDARD" })),
            active: t.Optional(t.Boolean()),
            password: t.Optional(t.String({ minLength: 8, maxLength: 128 })),
            profile: t.Optional(
              t.Object({
                firstName: t.Optional(t.String()),
                lastName: t.Optional(t.String()),
                address: t.Optional(t.String()),
                phoneNumber: t.Optional(t.String()),
              })
            ),
          }),
          detail: { tags: ["admin"] },
        }
      )
      
      // Delete user
      .delete(
        "/:id",
        async ({ params, set }) => {
          const { id } = params;

          // Check if user exists
          const existingUser = await prisma.account.findUnique({
            where: { id },
          });

          if (!existingUser) {
            set.status = 404;
            return buildApiResponse(false, "User not found");
          }

          // Delete related data first
          await prisma.$transaction([
            prisma.appointment.deleteMany({ where: { accountId: id } }),
            prisma.business.deleteMany({ where: { accountId: id } }),
            prisma.profile.deleteMany({ where: { accountId: id } }),
            prisma.account.delete({ where: { id } }),
          ]);

          return buildApiResponse(true, "user deleted successfully");
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: { tags: ["admin"] },
        }
      )
      
      // Get system statistics
      .get(
        "/stats",
        async () => {
          const [
            totalUsers,
            totalBusinesses,
            totalAppointments,
            totalServices,
            activeUsers,
            newUsersThisMonth,
          ] = await Promise.all([
            prisma.account.count(),
            prisma.business.count(),
            prisma.appointment.count(),
            prisma.service.count(),
            prisma.account.count({ where: { active: true } }),
            prisma.account.count({
              where: {
                createDate: {
                  gte: new Date(new Date().setDate(1)),
                },
              },
            }),
          ]);

          return buildApiResponse(true, "system statistics", {
            totalUsers,
            totalBusinesses,
            totalAppointments,
            totalServices,
            activeUsers,
            newUsersThisMonth,
          });
        },
        { detail: { tags: ["admin"] } }
      )
  );
