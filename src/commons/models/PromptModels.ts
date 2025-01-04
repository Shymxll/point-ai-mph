import { z } from "zod"

export const SPrompt = z.object({
    promptId: z.number(),
    promptName: z.string(),
    promptState: z.boolean()
})

export type Prompt = z.infer<typeof SPrompt>

export const SPromptInsert = z.object({
    promptName: z.string().min(1, {
        message: "Prompt boş olamaz.",
    }),
})

export type PromptInsert = z.infer<typeof SPromptInsert>


export const SPromptUpdate = z.object({
    promptId: z.number(),
    promptName: z.string().min(1, {
        message: "Prompt boş olamaz.",
    }),
    promptState: z.boolean()
})

export type PromptUpdate = z.infer<typeof SPromptUpdate>
