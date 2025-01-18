import z, { Primitive } from 'zod'

const emailSchema = z.string().email({ message: "Invalid Email Address" });
const usernameSchema = z.string()
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]{0,28}[a-zA-Z0-9])?$/, {
        message: "Invalid Username format",
    })
const passwordSchema = z.string().min(8, { message: "Min Password length is 8" }).max(20, { message: "Max Password Length is 20" })

export const signupSchema = z.object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    type: z.enum(["admin","user"])
})

export const signinSchema = z.object({
    identifier: z.union([
        emailSchema, usernameSchema
    ]),
    password:passwordSchema
})

export const elementSchema = z.object({
    imageUrl:z.string().url(),
    width:z.number().min(1,{message:"Min 1 width is required"}),
    height:z.number().min(1,{message:"Min 1 height is required"}),
    static:z.boolean()
})

export const updateElementSchema = z.object({
    imageUrl:z.string().url(),
})

export const avatarSchema = z.object({
    imageUrl:z.string().url(),
    name:z.string()
})

const dimensionSchema = z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/)

export const mapSchema = z.object({
    thumbnail: z.string(),
    dimensions: dimensionSchema,
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),  
        y: z.number(),
    }))
})

export const metadataValidator = z.object({
    avatarId:z.string()
})

export const spaceSchema = z.object({
    dimensions:dimensionSchema,
    name:z.string().min(3,{message:"Name Should contain 3 characters"})
})

export const spaceElementSchema = z.object({
    x:z.number().min(0,{message:"Invalid Coord for X"}),
    y:z.number().min(0,{message:"Invalid Coord for Y"}),
})