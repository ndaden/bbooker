import { Elysia } from "elysia";
import { isAuthenticated } from "../../middlewares/authentication";
import { businessBodyType, businessUpdateBodyType } from "./types";
import { prisma } from "../../libs/prisma";
import { buildApiResponse } from "../../utils/api";
import { AUTHORIZED_FILE_TYPES, MAX_FILE_SIZE, storage } from "../../utils/upload"
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { sha256hash } from "../../utils/crypto";


export const business = (app: Elysia) => app.group('/business', (app) =>
    app.get('/', async () => {
        return buildApiResponse(true, "", await prisma.business.findMany({ include: { services: true }}))
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

            const { name, description, services } = body

            // Create business with its services
            const businessCreated = await prisma.business.create({
                data: {
                    name,
                    description,
                    accountId: account.id,
                    services: { createMany: { data: services } }
                }
            })

            return buildApiResponse(true, "business and services created.", businessCreated)

        }, { body: businessBodyType, detail: { tags: ['business'] } })
        .patch('/:id', async ({ params,set, body }) => {
            const { id } = params
            const { name, description, image, services } = body
            let imageUrl = 'dummy url'

            // upload image to firebase 
            if (image) {
                const extension = image.name.split('.').pop()
                if(!AUTHORIZED_FILE_TYPES.includes(image.type)){
                    set.status = 400
                    return buildApiResponse(false, "unauthorized file type.")
                }
                if(image.size > MAX_FILE_SIZE) {
                    set.status = 400
                    return buildApiResponse(false, "file is too big.")
                }            
                const storageRef = ref(storage,  `${sha256hash(image.name)}.${extension}`);
                const snapshot = await uploadBytes(storageRef, await image.arrayBuffer());
                imageUrl = await getDownloadURL(snapshot.ref);
            } 

            const updatedBusiness = await prisma.business.update({
                where: {
                    id: id
                }, data: {
                    name, description, image: imageUrl, services: services && { createMany: { data: services } }
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
            // must also delete image from firebase
        }, { detail: { tags: ['business'] } }))