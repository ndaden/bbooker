import { Elysia, t } from "elysia";
import { isAuthenticated } from "../../middlewares/authentication";
import { checkAppointmentAccess } from "../../middlewares/authorization";
import { createAppointmentType } from "./types";
import { prisma } from "../../libs/prisma";
import { buildApiResponse } from "../../utils/api";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

export const appointment = (app: Elysia) =>
  app.group("/appointment", (app) =>
    app
      .get(
        "/slots/:businessId",
        async ({ params, query }) => {
          const { businessId } = params;
          const { startTimeInterval, endTimeInterval, slotDurationInMinutes } =
            query;

          let slots = [];

          if (businessId) {
            // Fetch business with hours configuration
            const business = await prisma.business.findFirst({
              where: { id: businessId },
              select: { businessHours: true },
            });

            const appointmentsForBusiness = await prisma.appointment.findMany({
              where: {
                service: {
                  businessId: businessId,
                },
              },
            });

            let startInterval = dayjs.unix(Number(startTimeInterval));
            const endInterval = dayjs.unix(Number(endTimeInterval));

            // Helper to get hours for a specific day
            const getHoursForDay = (dayOfWeek: number) => {
              if (!business?.businessHours || !Array.isArray(business.businessHours)) {
                // Default hours if not configured: 8:00-19:00, all days open
                return { openTime: "08:00", closeTime: "19:00", closed: false };
              }
              const dayHours = (business.businessHours as any[]).find(
                (h) => h.day === dayOfWeek
              );
              return (
                dayHours || { openTime: "08:00", closeTime: "19:00", closed: true }
              );
            };

            while (startInterval.isBefore(endInterval)) {
              const dayOfWeek = startInterval.day(); // 0=Sunday, 6=Saturday
              const dayHours = getHoursForDay(dayOfWeek);

              // Skip closed days
              if (dayHours.closed) {
                startInterval = startInterval.add(1, "day").startOf("day");
                continue;
              }

              // Parse open/close times
              const [openHour, openMin] = dayHours.openTime.split(":").map(Number);
              const [closeHour, closeMin] = dayHours.closeTime
                .split(":")
                .map(Number);

              // Create time boundaries for the day
              const dayStart = startInterval
                .startOf("day")
                .hour(openHour)
                .minute(openMin);
              const dayEnd = startInterval
                .startOf("day")
                .hour(closeHour)
                .minute(closeMin)
                .subtract(Number(slotDurationInMinutes), "minutes");

              // Check if current time is within business hours
              if (
                startInterval.isSameOrAfter(dayStart) &&
                startInterval.isBefore(dayEnd)
              ) {
                const slotFree = !appointmentsForBusiness.find((appt) =>
                  startInterval.isBetween(
                    appt.startTime,
                    appt.endTime,
                    "minutes",
                    "[)"
                  )
                );
                slots.push({
                  free: slotFree,
                  startTime: startInterval,
                  endTime: startInterval.add(
                    Number(slotDurationInMinutes),
                    "minutes"
                  ),
                });
              }

              startInterval = startInterval.add(
                Number(slotDurationInMinutes),
                "minutes"
              );

              // Skip to next day if past closing time
              if (startInterval.isAfter(dayEnd)) {
                startInterval = startInterval.add(1, "day").startOf("day");
              }
            }
          }

          return buildApiResponse(true, "slots for service", slots);
        },
        {
          detail: { tags: ["appointment"] },
        }
      )
      .use(isAuthenticated)
      .get(
        "/",
        async ({ account, query }) => {
          // TODO
          // 1 - standard user must be able to fetch only the list of his appointments
          // 2 - owner must be able to fetch the list of appointment with services associated to his business

          if (!account) {
            return buildApiResponse(false, "unauthorized");
          }

          const { serviceId, accountId } = query;

          let foundAppointments;

          // OWNER role can view appointments for their business services
          if (account.role === "OWNER") {
            // Get all appointments for services belonging to owner's businesses
            foundAppointments = await prisma.appointment.findMany({
              where: {
                service: {
                  business: {
                    accountId: account.id,
                  },
                },
              },
              include: {
                service: {
                  include: {
                    business: true,
                  },
                },
              },
            });
          } else if (serviceId) {
            // Filter by service (admin only)
            foundAppointments = await prisma.appointment.findMany({
              where: {
                serviceId,
              },
              include: {
                service: {
                  include: {
                    business: true,
                  },
                },
              },
            });
          } else if (accountId && accountId === account.id) {
            // Standard users can only view their own appointments
            foundAppointments = await prisma.appointment.findMany({
              where: {
                accountId,
              },
              include: {
                service: {
                  include: {
                    business: true,
                  },
                },
              },
            });
          } else {
            // Default: standard users only see their own appointments
            foundAppointments = await prisma.appointment.findMany({
              where: {
                accountId: account.id,
              },
              include: {
                service: {
                  include: {
                    business: true,
                  },
                },
              },
            });
          }

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
          const { serviceId, startTime } = body;

          const service = await prisma.service.findFirst({
            where: {
              id: serviceId,
            },
          });

          if (!service) {
            return buildApiResponse(false, "service does not exist.");
          }

          const endTime = dayjs(startTime).add(service.duration, "minutes");

          const appointmentsByService = await prisma.appointment.findMany({
            where: {
              service: { businessId: service.businessId },
            },
            include: {
              service: true,
            },
          });

          const conflictingAppointments = appointmentsByService.filter(
            (appt) => {
              return (
                ((dayjs(startTime).isAfter(appt.startTime) ||
                  dayjs(startTime).isSame(appt.startTime)) &&
                  dayjs(startTime).isBefore(appt.endTime)) ||
                dayjs(startTime).isSame(appt.endTime) ||
                ((dayjs(endTime).isAfter(appt.startTime) ||
                  dayjs(endTime).isSame(appt.startTime)) &&
                  (dayjs(endTime).isBefore(appt.endTime) ||
                    dayjs(endTime).isSame(appt.startTime)))
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
      .get(
        "/:id",
        async ({ account, params, set }) => {
          if (!account) {
            return buildApiResponse(false, "unauthorized");
          }

          const { id } = params as { id: string };
          const { allowed, error, appointment } = await checkAppointmentAccess(account, id);

          if (!allowed) {
            set.status = 403;
            return buildApiResponse(false, error);
          }

          return buildApiResponse(true, "appointment found", appointment);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: { tags: ["appointment"] },
        }
      )
      .patch(
        "/:id",
        async ({ account, body, params, set }) => {
          if (!account) {
            return buildApiResponse(false, "unauthorized");
          }

          const { id } = params as { id: string };
          const { allowed, error } = await checkAppointmentAccess(account, id);

          if (!allowed) {
            set.status = 403;
            return buildApiResponse(false, error);
          }

          const { startTime, serviceId } = body as { startTime?: string; serviceId?: string };

          // If changing service, verify new service exists
          if (serviceId) {
            const service = await prisma.service.findFirst({
              where: { id: serviceId },
            });
            if (!service) {
              return buildApiResponse(false, "service does not exist");
            }
          }

          // Calculate new end time if start time changed
          let endTime;
          if (startTime) {
            const appointment = await prisma.appointment.findFirst({
              where: { id },
              include: { service: true },
            });
            const service = appointment?.service;
            if (service) {
              endTime = dayjs(startTime).add(service.duration, "minutes");
            }
          }

          const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
              ...(startTime && { startTime: dayjs(startTime).toDate() }),
              ...(endTime && { endTime: dayjs(endTime).toDate() }),
              ...(serviceId && { serviceId }),
              updateDate: new Date(),
            },
          });

          return buildApiResponse(true, "appointment updated", updatedAppointment);
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Optional(
            t.Object({
              startTime: t.Optional(t.String()),
              serviceId: t.Optional(t.String()),
            })
          ),
          detail: { tags: ["appointment"] },
        }
      )
      .delete(
        "/:id",
        async ({ account, params, set }) => {
          if (!account) {
            return buildApiResponse(false, "unauthorized");
          }

          const { id } = params as { id: string };
          const { allowed, error } = await checkAppointmentAccess(account, id);

          if (!allowed) {
            set.status = 403;
            return buildApiResponse(false, error);
          }

          await prisma.appointment.delete({
            where: { id },
          });

          return buildApiResponse(true, "appointment deleted successfully");
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: { tags: ["appointment"] },
        }
      )
  );
