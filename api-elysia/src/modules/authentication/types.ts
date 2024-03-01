import { t } from "elysia";

const accountBodyType = t.Object({
    email: t.String(),
    password: t.String(),
    passwordAgain: t.String(),
  })

const loginBodyType = t.Object({
    email: t.String(),
    password: t.String()
  })

export {accountBodyType, loginBodyType}