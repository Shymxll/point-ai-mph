export const allowedPaths: (string | RegExp)[] = [
    "/login",
];

export const isPathAllowed = (pathname: string) => {
    if (allowedPaths.includes(pathname)) return true;
};
