import { z } from "zod"


export const SApiResponse = z.object({
    isSuccessful: z.boolean(),
    statusCode: z.number(),
    errorMessage: z.string().optional(),
    data: z.object({}).optional(),
    errorMessageParameters: z.string().optional(),
})

export type ApiResponse = z.infer<typeof SApiResponse>

