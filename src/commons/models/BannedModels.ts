import z from "zod";

export const BannedMainManager = z.object({
    bannedId: z.number(),
    bannedName: z.string(),
    bannedState: z.boolean(),
});

export type BannedMainManager = z.infer<typeof BannedMainManager>;


export const BannedMainManagerResponse = z.object({
    data: BannedMainManager,
});

export type BannedMainManagerResponse = z.infer<typeof BannedMainManagerResponse>;


export const BannedMainManagerListResponse = z.object({
    data: z.array(BannedMainManager),
});

export type BannedMainManagerListResponse = z.infer<typeof BannedMainManagerListResponse>;

