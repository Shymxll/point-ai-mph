import { z } from "zod";

const SQuestionGroup = z.object({
    groupId: z.string(),
    groupName: z.string(),
    state: z.string(),
})

export type QuestionGroup = z.infer<typeof SQuestionGroup>;

export const SQuestionGroupsResponse = z.object({
    data: z.array(SQuestionGroup),
})

export type QuestionGroupsResponse = z.infer<typeof SQuestionGroupsResponse>;

export const SQuestionGroupResponse = z.object({
    data: SQuestionGroup,
})

export type QuestionGroupResponse = z.infer<typeof SQuestionGroupResponse>;

export const SQuestionDetailInsert = z.object({
    userId: z.string(),
    groupId: z.number().optional().nullable(),
    question: z.string(),
    answer: z.string(),
})

export type QuestionDetailInsert = z.infer<typeof SQuestionDetailInsert>;

export const SQuestionGroupDetails = z.object({
    id: z.number().optional().nullable(),
    groupId: z.number(),
    question: z.string(),
    answer: z.string(),
    getValue: z.number().optional().nullable(),
})

export type QuestionGroupDetails = z.infer<typeof SQuestionGroupDetails>;

export const SQuestionGroupDetailsResponse = z.object({
    data: z.array(SQuestionDetailInsert),
})

export type QuestionGroupDetailsResponse = z.infer<typeof SQuestionGroupDetailsResponse>;

