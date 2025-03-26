import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addNote = asyncHandler(async (req, res) => {
    const {title, content} = req.body
    const userId = req.user._id

    if (!title || !content) {
        throw new ApiError(404,"All Feild required")
    }

    const note = await Note.create(
        {
            title,
            content,
            creater: userId
        }
    )

    if(!note) {
        throw new ApiError(501,"Something wnet wrong while creating Note..!")
    }

    const user = await User.findById(userId)

    user.myNotes.push(note._id)

    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            note,
            "Note Created Successfully"
        ))

})

const updateNote = asyncHandler(async (req, res) => {

})

const deleteNote = asyncHandler(async (req, res) => {

})

const viewNote = asyncHandler (async (req, res) => {

})


export {
    addNote,
    updateNote,
    deleteNote,
    viewNote
}
