import { z } from 'zod'
import { jwtDecode } from "jwt-decode";

export const SUserLogin = z.object({
    locationId: z.string(),
    username: z.string(),
    password: z.string(),
})

export type UserLogin = z.infer<typeof SUserLogin>

const SUser = z
    .object({
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
            z.string(),
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": z.string(),
        TicketName: z.string().optional(),
        TitleId: z.string().optional(),
        RoleId: z.string().optional(), // Added RoleId field
        JobId: z.string().optional(), // Added JobId field
        DepartmentId: z.string().optional(), // Added DepartmentId field
        IconName: z.string().optional(),
        jti: z.string(),
        aud: z.string(),
        nbf: z.number(),
        exp: z.number(),
        iss: z.string(),
    })
    .transform((payload) => ({
        userId:
            payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
        username:
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        ticketName: payload.TicketName,
        titleId: payload.TitleId,
        roleId: payload.RoleId,
        jobId: payload.JobId,
        departmentId: payload.DepartmentId,
        iconName: payload.IconName,
        jti: payload.jti,
        aud: payload.aud,
        nbf: payload.nbf,
        exp: payload.exp,
        iss: payload.iss,
    }));

export type User = z.infer<typeof SUser>;


export function parseJwt(token: string): User {
    const decodedToken = jwtDecode(token);
    return SUser.parse(decodedToken);
}