export const allowedPaths: (string | RegExp)[] = [
    "/user/login",
    "/user/forgot-password",
    "/admin/login",
    "/admin/forgot-password",
];

export const isPathAllowed = (pathname: string) => {
    if (allowedPaths.includes(pathname)) return true;
};
