import jwt from "jsonwebtoken"

export const generateAccessToken = (user: { id: number, username: string }) => {
    return jwt.sign(
        { id:user.id,username:user.username },
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
export const generateRefreshToken = (user: { id: number }) => {
    return jwt.sign(
        { id:user.id },
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}
