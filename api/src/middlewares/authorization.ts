import { Elysia } from "elysia";
import { prisma } from "../libs/prisma";
import { buildApiResponse } from "../utils/api";

/**
 * Middleware to check if current user owns the resource
 * Must be used AFTER isAuthenticated middleware
 */
export const checkAppointmentAccess = async (account: any, appointmentId: string) => {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
    include: {
      service: {
        include: {
          business: true,
        },
      },
    },
  });

  if (!appointment) {
    return { allowed: false, error: "Appointment not found", appointment: null };
  }

  // Admin can access any appointment
  if (account.role === "ADMIN") {
    return { allowed: true, error: null, appointment };
  }

  // Client who booked the appointment can access
  if (appointment.accountId === account.id) {
    return { allowed: true, error: null, appointment };
  }

  // Owner of the business can access
  const businessOwnerId = appointment.service?.business?.accountId;
  if (businessOwnerId === account.id) {
    return { allowed: true, error: null, appointment };
  }

  return { allowed: false, error: "Unauthorized access to appointment", appointment: null };
};

/**
 * Check if user can access a specific business
 */
export const checkBusinessAccess = async (account: any, businessId: string) => {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
    },
  });

  if (!business) {
    return { allowed: false, error: "Business not found", business: null };
  }

  // Admin can access any business
  if (account.role === "ADMIN") {
    return { allowed: true, error: null, business };
  }

  // Owner can access their own business
  if (business.accountId === account.id) {
    return { allowed: true, error: null, business };
  }

  return { allowed: false, error: "Unauthorized access to business", business: null };
};

/**
 * Check if user can access a specific service
 */
export const checkServiceAccess = async (account: any, serviceId: string) => {
  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
    },
    include: {
      business: true,
    },
  });

  if (!service) {
    return { allowed: false, error: "Service not found", service: null };
  }

  // Admin can access any service
  if (account.role === "ADMIN") {
    return { allowed: true, error: null, service };
  }

  // Owner of the business can access their services
  if (service.business?.accountId === account.id) {
    return { allowed: true, error: null, service };
  }

  return { allowed: false, error: "Unauthorized access to service", service: null };
};

/**
 * Middleware for admin-only routes
 */
export const requireAdmin = (app: Elysia) =>
  app.onBeforeHandle(({ set, account }) => {
    if (!account) {
      set.status = 401;
      return buildApiResponse(false, "Unauthorized");
    }

    if (account.role !== "ADMIN") {
      set.status = 403;
      return buildApiResponse(false, "Admin access required");
    }
  });

/**
 * Check if user can access another user's profile
 * Users can only access their own profile unless they're admin
 */
export const checkProfileAccess = (account: any, targetUserId: string) => {
  if (!account) {
    return { allowed: false, error: "Unauthorized" };
  }

  // Admin can access any profile
  if (account.role === "ADMIN") {
    return { allowed: true, error: null };
  }

  // Users can only access their own profile
  if (account.id === targetUserId) {
    return { allowed: true, error: null };
  }

  return { allowed: false, error: "Unauthorized access to profile" };
};
