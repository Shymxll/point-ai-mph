import { z } from "zod";

const OpenaiRequest = z.object({
    role: z.string(),
    content: z.string(),
})

export type OpenaiRequest = z.infer<typeof OpenaiRequest>;

const OpenaiResponse = z.object({
    choices: z.array(z.object({
        message: z.object({
            content: z.string(),
        })
    })),
})

export type OpenaiResponse = z.infer<typeof OpenaiResponse>;