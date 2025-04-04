import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    console.log("🔍 MONGODB_URI being used:", `${process.env.MONGODB_URI}/${DB_NAME}`);
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongo DB connected  !! DB Host: ${connectionInstance.connection.host}`);
        // console.log(connectionInstance);
        
        
    } catch (error) {
        console.log("MONGODB connection Failed", error);
        process.exit(1)
    }
}

export default connectDB