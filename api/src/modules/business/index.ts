import { Elysia, t } from "elysia";
import { isAuthenticated } from "../../middlewares/authentication";
import { businessBodyType, businessUpdateBodyType } from "./types";
import { prisma } from "../../libs/prisma";
import { buildApiResponse } from "../../utils/api";
import { uploadImageToR2, deleteImageFromR2 } from "../../utils/upload";
import { getErrorMessage } from "../../utils/errors";
import { geocodeAddress } from "../../utils/geocoding";
import { logger } from "../../utils/logger";

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const business = (app: Elysia) => app.group('/business', (app) =>
    // Public endpoints
    app.get('/search', async ({ query }) => {
      const { q, lat, lng, radius = '10' } = query;
      
      const searchQuery = q?.toString().toLowerCase() || '';
      const userLat = lat ? parseFloat(lat.toString()) : null;
      const userLng = lng ? parseFloat(lng.toString()) : null;
      const searchRadius = parseFloat(radius.toString()) || 10; // Default 10km radius
      
      // Search businesses by name or services
      const businesses = await prisma.business.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { address: { contains: searchQuery, mode: 'insensitive' } },
            {
              services: {
                some: {
                  OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { description: { contains: searchQuery, mode: 'insensitive' } }
                  ]
                }
              }
            }
          ]
        },
        include: { services: true }
      });
      
      // If user location is provided, filter by radius and sort by distance
      let filteredBusinesses = businesses;
      if (userLat !== null && userLng !== null) {
        filteredBusinesses = businesses
          .map(business => {
            const distance = (business.latitude && business.longitude)
              ? calculateDistance(userLat, userLng, business.latitude, business.longitude)
              : Infinity;
            return { ...business, distance };
          })
          .filter(business => business.distance <= searchRadius)
          .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }
      
      return buildApiResponse(true, "search results", filteredBusinesses);
    }, { 
      detail: { tags: ['business'] },
      query: t.Object({
        q: t.Optional(t.String()),
        lat: t.Optional(t.String()),
        lng: t.Optional(t.String()),
        radius: t.Optional(t.String())
      })
    })
    .get('/', async () => {
        return buildApiResponse(true, "", await prisma.business.findMany({ include: { services: true } }))
    }, { detail: { tags: ['business'] } })
    .get('/:id', async ({ params }) => {
        const { id } = params
        return buildApiResponse(
            true,
            "",
            await prisma.business.findFirst({ where: { id: id }, include: { services: true } }))
    }, { detail: { tags: ['business'] } })
    .use(isAuthenticated)
    .post(
      "/",
      async ({ request, set, account }) => {
        if (!account) {
            return buildApiResponse(false, "Unauthorized")
        }

        // Parse FormData manually
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const address = formData.get('address')?.toString();
        const image = formData.get('image') as File | undefined;
        const keywordsStr = formData.get('keywords')?.toString();
        const servicesStr = formData.get('services')?.toString();
        const keywords = keywordsStr ? JSON.parse(keywordsStr) : [];
        const services = servicesStr ? JSON.parse(servicesStr) : [];
        
        let imageUrl = ''

        // Upload image if provided
        if (image) {
            const uploadResult = await uploadImageToR2(image, account.id, 'business-image')
            if (!uploadResult.success) {
                set.status = "Bad Request"
                return buildApiResponse(false, uploadResult.error ?? '')
            }
            imageUrl = uploadResult.url ?? ''
        }

        // Geocode address if provided
        let latitude: number | undefined
        let longitude: number | undefined

        if (address && address.trim().length > 0) {
            const geocodingResult = await geocodeAddress(address)
            if (geocodingResult) {
                latitude = geocodingResult.latitude
                longitude = geocodingResult.longitude
            }
        }

        // Create business with its services
        const businessCreated = await prisma.business.create({
            data: {
                name,
                description,
                accountId: account.id,
                address,
                latitude,
                longitude,
                keywords: keywords || [],
                image: imageUrl || undefined,
                services: { createMany: { data: services } }
            }, include: { services: true }
        })

        return buildApiResponse(true, "business and services created.", businessCreated)

    },
    { body: t.Any(), detail: { tags: ['business'] } })
    .patch('/:id', 
      async ({ params, set, account, request }) => {
        const { id } = params

        if (!account) {
            return buildApiResponse(false, "Unauthorized")
        }

        const businessToUpdate = await prisma.business.findFirst({
            where: {
                id: id,
                AND: {
                    accountId: account.id
                }
            },
            select: {
                id: true,
            }
        })

        if (!businessToUpdate) {
            return buildApiResponse(false, "Cannot update")
        }

        // Parse FormData manually
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const address = formData.get('address')?.toString();
        const image = formData.get('image') as File | undefined;
        const keywordsStr = formData.get('keywords')?.toString();
        const servicesStr = formData.get('services')?.toString();
        const keywords = keywordsStr ? JSON.parse(keywordsStr) : undefined;
        const services = servicesStr ? JSON.parse(servicesStr) : undefined;

        let imageUrl: string | undefined;

        // Upload image if provided
        if (image) {
            const uploadResult = await uploadImageToR2(image, account.id, 'business-image')
            if (!uploadResult.success) {
                set.status = "Bad Request"
                return buildApiResponse(false, uploadResult.error ?? '')
            }
            imageUrl = uploadResult.url ?? ''
        }

        // Get current business to check if address changed
        const currentBusiness = await prisma.business.findFirst({
            where: {
                id: id,
                AND: {
                    accountId: account.id
                }
            }
        })

        let latitude = currentBusiness?.latitude
        let longitude = currentBusiness?.longitude

        // Geocode new address if provided and different from current
        if (address !== undefined && address !== currentBusiness?.address) {
            if (address && address.trim().length > 0) {
                const geocodingResult = await geocodeAddress(address)
                if (geocodingResult) {
                    latitude = geocodingResult.latitude
                    longitude = geocodingResult.longitude
                }
            } else {
                // Address cleared, reset coordinates
                latitude = null
                longitude = null
            }
        }

        // Build update data object - only include fields that were provided
        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (address !== undefined) updateData.address = address
        if (latitude !== undefined && currentBusiness?.latitude !== latitude) updateData.latitude = latitude
        if (longitude !== undefined && currentBusiness?.longitude !== longitude) updateData.longitude = longitude
        if (imageUrl) updateData.image = imageUrl
        if (keywords) updateData.keywords = keywords
        if (services) updateData.services = { createMany: { data: services } }
        updateData.updateDate = new Date()

        const updatedBusiness = await prisma.business.update({
            where: {
                id: id,
                AND: {
                    accountId: account.id
                }
            },
            data: updateData
        })

        return buildApiResponse(true, "business updated", updatedBusiness)

      },
      { body: t.Any(), detail: { tags: ['business'] } }
    )
    .delete('/:id', async ({ params, account }) => {
        const { id } = params

        if (!account) {
            return buildApiResponse(false, "Unauthorized")
        }

        try {
            const businessToDelete = await prisma.business.findFirst({
                where: {
                    id: id,
                    AND: {
                        accountId: account?.id
                    }
                },
                select: {
                    id: true,
                }
            })

            if (!businessToDelete) {
                return buildApiResponse(false, "Cannot delete")
            }

            await prisma.service.deleteMany({
                where: {
                    businessId: businessToDelete.id
                }
            })

            await prisma.business.delete({
                where: {
                    id: businessToDelete.id
                },
                select: {
                    id: true,
                    createDate: false
                }
            })

            // Delete image from R2
            const business = await prisma.business.findFirst({ where: { id: businessToDelete.id } });
            if (business?.image) {
                await deleteImageFromR2(business.image);
            }

            return buildApiResponse(true, "deleted successfully.")
        } catch (error: any) {
            logger.error('Business deletion error', error instanceof Error ? error : new Error(String(error)));
            return buildApiResponse(false, getErrorMessage(error.code))
        }
    }, { detail: { tags: ['business'] } }))
