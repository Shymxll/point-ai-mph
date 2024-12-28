import { z } from "zod"
import { SApiResponse } from "./GeneralModels"

export const Location = z.object({
    locationId: z.string(),
    locationName: z.string(),
})

export type Location = z.infer<typeof Location>

const LocationResponse = SApiResponse.extend({
    data: z.array(Location)
})

export type LocationResponse = z.infer<typeof LocationResponse>