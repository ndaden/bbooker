import { t } from "elysia";

export const createAppointmentType = t.Object({
  serviceId: t.String(),
  startTime: t.Date(),
  endTime: t.Date(),
});
