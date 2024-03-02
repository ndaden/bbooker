import { Role } from "@prisma/client";
import { t } from "elysia";

const accountBodyType = t.Object({
    email: t.String(),
    password: t.String(),
    passwordAgain: t.String(),
  })

const profileBodyType = t.Object({
  firstName: t.Optional(t.String()),
  lastName:t.Optional(t.String()), 
  address:t.Optional(t.String()),
  phoneNumber: t.Optional(t.String()),
  profileImage: t.Optional(t.File())
})

const patchAccountBodyType = t.Object({
    email: t.Optional(t.String()),
    password: t.Optional(t.String()),
    newPassword: t.Optional(t.String()),
    active: t.Optional(t.Boolean()),
    role: t.Optional(t.Enum(Role)),
    newPasswordAgain: t.Optional(t.String()),
    profile: t.Optional(profileBodyType)
  })

const loginBodyType = t.Object({
    email: t.String(),
    password: t.String()
  })

export {accountBodyType, loginBodyType, patchAccountBodyType}