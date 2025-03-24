import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())

// Import Routes
import userRouter from "./routes/user.routes.js"


//routs declaration
app.use("/api/v1/users", userRouter)


export default app