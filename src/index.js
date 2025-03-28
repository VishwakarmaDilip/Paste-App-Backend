import dotenv from "dotenv"
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

connectDB()
    .then(() => {
        app.on("Error", (error) => {
            console.log(("Error :", error));
            throw error

        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port : ${process.env.PORT}`);

        })
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!!", err);

    })