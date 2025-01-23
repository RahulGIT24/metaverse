// roles.js

export interface Roles{
    ADMIN:string,
    USER:string
}

export const roles:Roles = {
    ADMIN: "admin",
    USER: "user",
};

const userRoutes = ["/profile"]

export const permissions = {
    [roles.ADMIN]: [...userRoutes,"/admin/createmap"],
    [roles.USER]: userRoutes,
};
