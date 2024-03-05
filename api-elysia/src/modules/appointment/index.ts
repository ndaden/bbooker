import { Elysia, t } from "elysia";
import { isAuthenticated } from "../../middlewares/authentication";
import { createAppointmentType } from "./types";
import { prisma } from "../../libs/prisma";
import { buildApiResponse } from "../../utils/api";
import dayjs from "dayjs";

export const appointment = (app: Elysia) =>
  app.group("/appointment", (app) =>
    app
      .use(isAuthenticated)
      .get(
        "/",
        async ({ account, query }) => {
          if (!account) {
            return buildApiResponse(false, "unauthorized");
          }

          const { serviceId, accountId } = query;

          let foundAppointments;

          if (serviceId) {
            foundAppointments = await prisma.appointment.findMany({
              where: {
                serviceId,
              },
            });
          }

          if (accountId && accountId === account.id) {
            foundAppointments = await prisma.appointment.findMany({
              where: {
                accountId,
              },
            });
          }

          foundAppointments = await prisma.appointment.findMany();

          return buildApiResponse(true, "appointments", foundAppointments);
        },
        {
          query: t.Optional(
            t.Object({
              serviceId: t.Optional(t.String()),
              accountId: t.Optional(t.String()),
            })
          ),
          detail: { tags: ["appointment"] },
        }
      )
      .post(
        "/",
        async ({ account, body }) => {
          if (!account) {
            return buildApiResponse(false, "unauthorized");
          }
          const { serviceId, startTime, endTime } = body;

          if (dayjs(startTime).isAfter(dayjs(endTime))) {
            return buildApiResponse(false, "startTime must be before endTime");
          }

          const service = await prisma.service.findFirst({
            where: {
              id: serviceId
            }
          })

          if(!service) {
            return buildApiResponse(false, "service does not exist.")
          }

          const appointmentsByService = await prisma.appointment.findMany({
            where: {
              serviceId: serviceId,
            },
          });

          const conflictingAppointments = appointmentsByService.filter(
            (appt) => {
              return (
                (dayjs(startTime).isAfter(appt.startTime) || dayjs(startTime).isSame(appt.startTime)) &&
                  dayjs(startTime).isBefore(appt.endTime) || dayjs(startTime).isSame(appt.endTime)) ||
                ((dayjs(endTime).isAfter(appt.startTime) || dayjs(endTime).isSame(appt.startTime)) &&
                  (dayjs(endTime).isBefore(appt.endTime)|| dayjs(endTime).isSame(appt.startTime))
              );
            }
          );

          if (conflictingAppointments && conflictingAppointments.length > 0) {
            return buildApiResponse(
              false,
              "found conflicting appointments on same service"
            );
          }

          const appt = await prisma.appointment.create({
            data: {
              accountId: account.id,
              serviceId,
              startTime: dayjs(startTime).toDate(),
              endTime: dayjs(endTime).toDate(),
            },
          });

          return buildApiResponse(
            true,
            "appointment created successfully.",
            appt
          );
        },
        {
          body: createAppointmentType,
          detail: { tags: ["appointment"] },
        }
      )
      .patch("/:id", async ({ account, body, params }) => { }, {
        detail: { tags: ["appointment"] },
      })
      .delete("/:id", async ({ account, params }) => { }, {
        detail: { tags: ["appointment"] },
      })
  );
