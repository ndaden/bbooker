import React, { useState, useMemo } from "react";
import useFetchUserAppointments from "../../hooks/useFetchUserAppointments";
import {
  Card,
  CardBody,
  Input,
  Button,
  Chip,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { BsCalendar3, BsClock } from "react-icons/bs";
import { User } from "../../types/auth";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";

dayjs.extend(isBetween);
dayjs.locale("fr");

interface UserAppointmentsProps {
  user: User;
}

interface Appointment {
  id: string;
  _id?: string;
  startTime: string;
  endTime: string;
  service?: {
    name: string;
    business?: {
      name: string;
    };
  };
  serviceId?: string;
  createDate?: string;
}

const UserAppointments = ({ user }: UserAppointmentsProps) => {
  const userId = (user as any)?._id || user?.id;
  const { appointments, isLoading } = useFetchUserAppointments(userId);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const appointmentList = useMemo(() => {
    const data = appointments?.payload || appointments || [];
    return Array.isArray(data) ? data : [];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (!appointmentList.length) return [];

    return appointmentList.filter((appointment: Appointment) => {
      if (!startDate && !endDate) return true;

      const appointmentDate = dayjs(appointment.startTime);
      const start = startDate ? dayjs(startDate).startOf("day") : null;
      const end = endDate ? dayjs(endDate).endOf("day") : null;

      if (start && end) {
        return appointmentDate.isBetween(start, end, "day", "[]");
      }
      if (start) {
        return appointmentDate.isAfter(start, "day") || appointmentDate.isSame(start, "day");
      }
      if (end) {
        return appointmentDate.isBefore(end, "day") || appointmentDate.isSame(end, "day");
      }
      return true;
    });
  }, [appointmentList, startDate, endDate]);

  const { pastAppointments, futureAppointments } = useMemo(() => {
    const now = dayjs();
    const past: Appointment[] = [];
    const future: Appointment[] = [];

    filteredAppointments.forEach((appointment: Appointment) => {
      const appointmentDate = dayjs(appointment.endTime);
      if (appointmentDate.isBefore(now)) {
        past.push(appointment);
      } else {
        future.push(appointment);
      }
    });

    return {
      pastAppointments: past.sort((a, b) => dayjs(b.startTime).valueOf() - dayjs(a.startTime).valueOf()),
      futureAppointments: future.sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()),
    };
  }, [filteredAppointments]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const formatAppointmentDate = (startTime: string, endTime: string) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const dateStr = start.format("dddd D MMMM YYYY");
    const timeStr = `${start.format("HH:mm")} - ${end.format("HH:mm")}`;
    return { dateStr, timeStr };
  };

  const renderAppointmentCard = (appointment: Appointment, isPast: boolean) => {
    const { dateStr, timeStr } = formatAppointmentDate(
      appointment.startTime,
      appointment.endTime
    );
    const serviceName = appointment.service?.name || "Service inconnu";
    const businessName = appointment.service?.business?.name || "Établissement inconnu";

    return (
      <Card
        key={appointment.id || appointment._id}
        className={`mb-3 ${isPast ? "opacity-70" : ""}`}
      >
        <CardBody className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{serviceName}</h4>
                <p className="text-sm text-gray-600">{businessName}</p>
              </div>
              <Chip
                size="sm"
                color={isPast ? "default" : "primary"}
                variant={isPast ? "flat" : "solid"}
              >
                {isPast ? "Passé" : "À venir"}
              </Chip>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <BsCalendar3 className="text-default-500" />
              <span className="capitalize">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BsClock className="text-default-500" />
              <span>{timeStr}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        Chargement de vos rendez-vous...
      </div>
    );
  }

  const totalCount = appointmentList.length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <h3 className="font-semibold mb-4">Filtrer par date</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="date"
              label="Date de début"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="sm"
            />
            <Input
              type="date"
              label="Date de fin"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="sm"
              min={startDate}
            />
          </div>
          {(startDate || endDate) && (
            <Button
              size="sm"
              variant="ghost"
              color="default"
              onClick={handleClearFilters}
              className="mt-4"
            >
              Effacer les filtres
            </Button>
          )}
        </CardBody>
      </Card>

      {/* Summary */}
      <div className="flex gap-4">
        <Chip color="primary" variant="flat">
          {futureAppointments.length} à venir
        </Chip>
        <Chip color="default" variant="flat">
          {pastAppointments.length} passés
        </Chip>
        {filteredAppointments.length !== totalCount && (
          <Chip color="warning" variant="flat">
            {filteredAppointments.length} sur {totalCount} affichés
          </Chip>
        )}
      </div>

      {/* Appointments List */}
      {appointmentList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📅</div>
          <p>Vous n'avez pas encore de rendez-vous.</p>
          <p className="text-sm mt-2">
            Réservez votre premier rendez-vous dès maintenant !
          </p>
        </div>
      ) : (
        <Accordion defaultExpandedKeys={["future"]} selectionMode="multiple">
          {/* Future Appointments */}
          <AccordionItem
            key="future"
            title={`Rendez-vous à venir (${futureAppointments.length})`}
            className="text-primary font-semibold"
          >
            {futureAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun rendez-vous à venir
              </p>
            ) : (
              <div className="space-y-2">
                {futureAppointments.map((appointment) =>
                  renderAppointmentCard(appointment, false)
                )}
              </div>
            )}
          </AccordionItem>

          {/* Past Appointments */}
          <AccordionItem
            key="past"
            title={`Rendez-vous passés (${pastAppointments.length})`}
          >
            {pastAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun rendez-vous passé
              </p>
            ) : (
              <div className="space-y-2">
                {pastAppointments.map((appointment) =>
                  renderAppointmentCard(appointment, true)
                )}
              </div>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default UserAppointments;
