import React from "react";
import { Switch, Input } from "@heroui/react";

export interface DayHours {
  day: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  openTime: string; // "HH:MM" format
  closeTime: string; // "HH:MM" format
  closed: boolean;
}

export type BusinessHours = DayHours[];

interface BusinessHoursInputProps {
  value: BusinessHours;
  onChange: (value: BusinessHours) => void;
  error?: string;
}

const DAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

// Default business hours: Monday-Friday 09:00-18:00, weekends closed
export const getDefaultBusinessHours = (): BusinessHours => {
  return DAYS.map((day) => ({
    day: day.value,
    openTime: "09:00",
    closeTime: "18:00",
    closed: day.value === 0 || day.value === 6, // Weekend closed
  }));
};

const BusinessHoursInput: React.FC<BusinessHoursInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const handleDayChange = (
    day: number,
    field: keyof DayHours,
    newValue: string | boolean
  ) => {
    const updated = value.map((h) =>
      h.day === day ? { ...h, [field]: newValue } : h
    );
    onChange(updated);
  };

  const validateTime = (day: DayHours): string | null => {
    if (day.closed) return null;
    
    const [openHour, openMin] = day.openTime.split(":").map(Number);
    const [closeHour, closeMin] = day.closeTime.split(":").map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    if (closeMinutes <= openMinutes) {
      return "L'heure de fermeture doit être après l'ouverture";
    }
    
    return null;
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium mb-4">
        Horaires d'ouverture
        {error && <p className="text-danger text-xs mt-1">{error}</p>}
      </div>

      {DAYS.map((day) => {
        const dayHours = value.find((h) => h.day === day.value) || {
          day: day.value,
          openTime: "09:00",
          closeTime: "18:00",
          closed: true,
        };
        const validationError = validateTime(dayHours);

        return (
          <div
            key={day.value}
            className="flex items-center gap-4 p-3 bg-default-50 rounded-lg"
          >
            <div className="w-24 font-medium text-sm">{day.label}</div>

            <Switch
              size="sm"
              isSelected={!dayHours.closed}
              onValueChange={(checked) =>
                handleDayChange(day.value, "closed", !checked)
              }
              classNames={{
                wrapper: "group-data-[selected=true]:bg-primary",
              }}
            >
              <span className="text-xs">Ouvert</span>
            </Switch>

            <div className="flex items-center gap-2 flex-1">
              <Input
                type="time"
                size="sm"
                value={dayHours.openTime}
                onChange={(e) =>
                  handleDayChange(day.value, "openTime", e.target.value)
                }
                isDisabled={dayHours.closed}
                classNames={{
                  input: "text-sm",
                }}
              />
              <span className="text-default-400">-</span>
              <Input
                type="time"
                size="sm"
                value={dayHours.closeTime}
                onChange={(e) =>
                  handleDayChange(day.value, "closeTime", e.target.value)
                }
                isDisabled={dayHours.closed}
                classNames={{
                  input: "text-sm",
                }}
              />
            </div>

            {validationError && (
              <div className="text-danger text-xs w-40">{validationError}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BusinessHoursInput;
