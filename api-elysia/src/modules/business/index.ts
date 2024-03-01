import { Elysia } from "elysia";
import { isAuthenticated } from "../../middlewares/authentication";
import { businessBodyType, businessUpdateBodyType } from "./types";
import { prisma } from "../../libs/prisma";
import { buildApiResponse } from "../../utils/api";

export const business = (app: Elysia) => app.group('/business', (app) =>
    app.get('/', async () => {
        return buildApiResponse(true, "", await prisma.business.findMany())
    }, { detail: { tags: ['business'] } })
        .get('/:id', async ({ params }) => {
            const { id } = params
            return buildApiResponse(
                true,
                "",
                await prisma.business.findFirst({ where: { id: id }, include: { services: true } }))
        }, { detail: { tags: ['business'] } })
        .use(isAuthenticated)
        .post('/', async ({ body, set, account }) => {
            if (!account) {
                return buildApiResponse(false, "Unauthorized")
            }

            const { name, description, image, services } = body

            // Upload image to firebase and retrieve url
            const imageUrl = ''

            // Create business with its services
            const businessCreated = await prisma.business.create({
                data: {
                    name,
                    description,
                    image: imageUrl,
                    account: { connect: account },
                    services: { createMany: { data: services } }
                }
            })

            return buildApiResponse(true, "business and services created.", businessCreated)

        }, { body: businessBodyType, detail: { tags: ['business'] } })
        .patch('/:id', async ({ params, body }) => {
            const { id } = params
            const { name, description, image, services } = body
            let imageUrl = ''

            if (image) {
                // upload image to firebase 
            }

            const updatedBusiness = await prisma.business.update({
                where: {
                    id: id
                }, data: {
                    name, description, image: imageUrl, services: { createMany: { data: services ?? [] } }
                }
            })
            return buildApiResponse(true, "business updated", updatedBusiness)

        }, { body: businessUpdateBodyType, detail: { tags: ['business'] } })
        .delete('/:id', async ({ params }) => {
            const { id } = params
            await prisma.business.delete({
                where: {
                    id: id
                },
                include: { services: true }
            })
        }, { detail: { tags: ['business'] } }))