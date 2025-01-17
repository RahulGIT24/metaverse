import z from 'zod'

const emailSchema = z.string().email({ message: "Invalid Email Address" });
const usernameSchema = z.string()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]{0,28}[a-zA-Z0-9])?$/, {
        message: "Invalid Username format",
    })
const passwordSchema = z.string().min(8, { message: "Min Password length is 8" }).max(20, { message: "Max Password Length is 20" })

export const signupSchema = z.object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema
})

export const signinSchema = z.object({
    identifier: z.union([
        emailSchema, usernameSchema
    ]),
    password:passwordSchema
})