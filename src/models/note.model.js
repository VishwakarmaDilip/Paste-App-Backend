import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        creater: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timestamps: true }
)


export const Note = mongoose.model("Note", noteSchema)