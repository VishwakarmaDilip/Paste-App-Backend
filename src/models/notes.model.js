import mongoose, { Schema } from "mongoose";

const notesSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        creater: [
            {
                createrId: {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                },
                name: String
            }
        ]
    },
    { timestamps: true }
)


export const Notes = mongoose.model("Notes", notesSchema)