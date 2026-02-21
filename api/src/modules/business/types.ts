import { t } from "elysia";

export interface DayHours {
    day: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
    openTime: string; // "HH:MM" format
    closeTime: string; // "HH:MM" format
    closed: boolean;
}

export type BusinessHours = DayHours[];

const serviceBodyType = t.Object({
    name: t.String(),
    description: t.String(),
    duration: t.Number(),
    price: t.Number()
})

const businessBodyType = t.Object({
    name: t.String(),
    description: t.String(),
    services: t.Array(serviceBodyType),
    address: t.Optional(t.String()),
    keywords: t.Optional(t.Array(t.String())),
    image: t.Optional(t.File()),
    businessHours: t.Optional(t.String()), // JSON string of BusinessHours array
  })

  const businessUpdateBodyType = t.Object({
    name: t.Optional(t.String()),
    description: t.Optional(t.String()),
    image: t.Optional(t.File()),
    services: t.Optional(t.Array(t.Optional(serviceBodyType))),
    address: t.Optional(t.String()),
    keywords: t.Optional(t.Array(t.String())),
    businessHours: t.Optional(t.String()), // JSON string of BusinessHours array
  })



export {businessBodyType, businessUpdateBodyType}