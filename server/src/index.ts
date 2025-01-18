import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();
dotenv.config({
    path:"./.env"
})
const PORT = process.env.PORT

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js"

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"*",
    credentials:true
}))

app.use("/api/v1",authRoutes)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/admin",adminRoutes)
app.get("/",(req,res)=>{res.send("Health Checked")})

app.listen(PORT, () => {
    console.log("Server running on PORT ", PORT)
})