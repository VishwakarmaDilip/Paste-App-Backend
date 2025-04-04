import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

const whiteList = process.env.CORS_ORIGIN_WHITELIST

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || whiteList.includes(origin)) {
            callback(null, true)
        }else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Import Routes
import userRouter from "./routes/user.routes.js"
import noteRouter from "./routes/note.routes.js"


//routs declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/notes",noteRouter)


export {app}