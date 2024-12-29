export const allowedPaths: (string | RegExp)[] = [
    "/user/login",
    "/user/forgot-password",
    "/admin/login",
];

export const isPathAllowed = (pathname: string) => {
    if (allowedPaths.includes(pathname)) return true;
};
