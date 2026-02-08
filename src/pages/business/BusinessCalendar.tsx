import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardBody, Chip } from "@nextui-org/react";
import dayjs from "dayjs";
import "./react-calendar-custom.css";

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  clientName?: string;
}

interface BusinessCalendarProps {
  appointments?: Appointment[];
}

const BusinessCalendar = ({ appointments = [] }: BusinessCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = dayjs(appointment.startTime).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Custom tile content to show appointment dots
  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const dayAppointments = appointmentsByDate[dateStr] || [];
    
    if (dayAppointments.length === 0) return null;
    
    return (
      <div className="flex justify-center gap-1 mt-1">
        {dayAppointments.slice(0, 3).map((_, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
        {dayAppointments.length > 3 && (
          <span className="text-xs text-primary">+</span>
        )}
      </div>
    );
  };

  // Get appointments for selected date
  const selectedDateStr = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null;
  const selectedDateAppointments = selectedDateStr ? appointmentsByDate[selectedDateStr] || [] : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileContent={tileContent}
          className="react-calendar-custom"
        />
      </div>
      
      <div className="lg:w-1/2">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate 
                ? `Rendez-vous du ${dayjs(selectedDate).format("DD/MM/YYYY")}`
                : "Sélectionnez une date"
              }
            </h3>
            
            {selectedDateAppointments.length === 0 ? (
              <p className="text-gray-500">
                {selectedDate 
                  ? "Aucun rendez-vous pour cette date"
                  : "Cliquez sur une date du calendrier pour voir les rendez-vous"
                }
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedDateAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 border rounded-lg bg-default-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{appointment.serviceName}</p>
                        {appointment.clientName && (
                          <p className="text-sm text-gray-600">
                            Client: {appointment.clientName}
                          </p>
                        )}
                      </div>
                      <Chip size="sm" color="primary">
                        {dayjs(appointment.startTime).format("HH:mm")} - {dayjs(appointment.endTime).format("HH:mm")}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCalendar;
