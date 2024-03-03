import { Elysia, t } from "elysia";
import { comparePassword, hashPassword } from "../../utils/crypto";
import { prisma } from "../../libs/prisma";
import { accountBodyType, loginBodyType, patchAccountBodyType } from "./types";
import { buildApiResponse } from "../../utils/api";
import { isAuthenticated } from "../../middlewares/authentication";

export const authentification = (app: Elysia) =>
    app.group('/auth', (app) => app
        .post('/signup', async ({ body, set }) => {
            const { email, password, passwordAgain } = body

            if (password === passwordAgain) {
                const { hash, salt } = await hashPassword(password)

                const newAccount = await prisma.account.create({
                    data: {
                        email,
                        hash,
                        salt,
                        role: "STANDARD"
                    }
                })

                set.status = "Created"
                return buildApiResponse(true, "account successfully create", newAccount)
            } else {
                set.status = "Bad Request"
                return buildApiResponse(false, "Passwords don't match")
            }

        },
            {
                body: accountBodyType,
                detail: { tags: ['auth'] }
            })
        .post('/login', async ({ body, set, jwt, setCookie }) => {
            const { email, password } = body
            const account = await prisma.account.findFirst({
                where: {
                    email
                }, select: {
                    id: true,
                    hash: true,
                    salt: true
                }
            })

            if (!account) {
                set.status = 400
                return buildApiResponse(false, "wrong email or password")
            }
            // check password
            const match = await comparePassword(password, account.salt, account.hash)

            if (!match) {
                set.status = 400
                return buildApiResponse(false, "wrong email or password")
            }

            // login OK!
            const accessToken = await jwt.sign({
                accountId: account.id,
            });

            setCookie("access_token", accessToken, {
                maxAge: 15 * 60, // 15 minutes
                path: "/",
            });

            return buildApiResponse(true, "login successful.");

        }, { body: loginBodyType, detail: { tags: ['auth'] } })
        .use(isAuthenticated)
        .get('/profile', ({ account, error }) => {
            if (account) {
                return buildApiResponse(true, "profile", account)
            }
            return error
        }, { detail: { tags: ['auth'] } })
        .patch('/profile', async ({ account, error, body, set }) => {
            if (!account) {
                return error
            }

            const { profile, email, password, newPassword, newPasswordAgain, active, role } = body

            let profileToUpdateOrCreate
            let accountToUpdateByUser = { email }

            if (profile) {
                const { firstName, lastName, address, phoneNumber, profileImage } = profile
                let profileImageUrl = 'dummy url'
                if (profileImage) {
                    // upload profile image and get url
                    const uploadResult = await uploadImageToFirebase(profileImage)

                    if (!uploadResult.success) {
                        set.status = "Bad Request"
                        return buildApiResponse(false, uploadResult.error ?? '')
                    }

                    profileImageUrl = uploadResult.url ?? ''
                }

                profileToUpdateOrCreate = {
                    firstName, lastName, address, phoneNumber, profileImage: profileImageUrl
                }
            }

            if (password && newPassword && newPasswordAgain) {
                if (newPassword !== newPasswordAgain) {
                    set.status = 400
                    return buildApiResponse(false, "passwords don't match")
                }

                // check password
                const match = await comparePassword(password, account.salt, account.hash)

                if (!match) {
                    set.status = 400
                    return buildApiResponse(false, "wrong password")
                }

                const { hash, salt } = await hashPassword(newPassword)

                // update password in database
                accountToUpdateByUser = {...accountToUpdateByUser, hash, salt}
            }

            let fieldsToUpdateByAdmin
            if (account.role === "ADMIN") {
                fieldsToUpdateByAdmin = {
                    active,
                    role
                }
            }

            const updatedAccount = await prisma.account.update({
                where: {
                    id: account.id,
                },
                data: {
                    ...accountToUpdateByUser,
                    ...fieldsToUpdateByAdmin,
                    profile: account.profile ? { update: profileToUpdateOrCreate } : { create: profileToUpdateOrCreate },
                    updateDate: new Date(),
                }, include: { profile: true }
            })

            return buildApiResponse(true, "account updated", updatedAccount)

        }, { body: patchAccountBodyType, detail: { tags: ['auth'] } })
        .get('/logout', ({ setCookie }) => {
            setCookie("access_token", undefined, {
                maxAge: 0,
                path: "/",
            });
            return buildApiResponse(true, "logged out.")
        }, { detail: { tags: ['auth'] } }))