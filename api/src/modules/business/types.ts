import { t } from "elysia";

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
  })

  const businessUpdateBodyType = t.Object({
    name: t.Optional(t.String()),
    description: t.Optional(t.String()),
    image: t.Optional(t.File()),
    services: t.Optional(t.Array(t.Optional(serviceBodyType))),
    address: t.Optional(t.String()),
    keywords: t.Optional(t.Array(t.String())),
  })



export {businessBodyType, businessUpdateBodyType}