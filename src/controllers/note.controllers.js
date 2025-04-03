import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body
    const userId = req.user._id

    if (!title || !content) {
        throw new ApiError(406, "All Feild required")
    }

    const isExist = await Note.findOne({content})

    if (isExist) {
        throw new ApiError(409, "Note Already Exist")
    }

    const note = await Note.create(
        {
            title,
            content,
            creater: userId
        }
    )

    if (!note) {
        throw new ApiError(500, "Something wnet wrong while creating Note..!")
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

const getNote = asyncHandler(async (req, res) => {
    // get note by id
    const {noteId} = req.params

    // console.log(noteId);
    // console.log(typeof (noteId));
    

    if (!noteId) {
        throw new ApiError(405, "note id is empty it is required")
    }

    // find id in db and update
    const note = await Note.findById(noteId)    

    if (!note) {
        throw new ApiError(404, "note not found with this id")
    }

    // send response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            note,
            "note fetched successfully"
        ))
})

const updateNote = asyncHandler(async (req, res) => {
    // get data like note id , title and content
    const {noteId} = req.params
    let { title, content } = req.body

    // veryfy data
    if (!noteId) {
        throw new ApiError(404, "note not found")
    }

    if (!title && !content) {
        throw new ApiError(402, "At least one feild required Title or Content")
    }

    // find note by id and update in db
    const note = await Note.findById(noteId)
    if (!title) {
        title = note.title
    }

    if (!content) {
        content = note.content
    }

    const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        {
            $set:{
                title,
                content
            }
        },
        {
            new:true
        }
    )

    // send response
    return res  
        .status(200)
        .json(new ApiResponse(
            200,
            updatedNote,
            "Note updated successfully"
        ))

})

const deleteNote = asyncHandler(async (req, res) => {
    // get note id 
    const {noteId} = req.params

    if (!noteId) {
        throw new ApiError(400, "note id is empty")
    }

    // find and delete from db
    const deletedNote = await Note.findByIdAndDelete(noteId)
    const user = await User.findById(req.user?._id)

    const indexOfDeletedNote = user.myNotes.findIndex(note => note === noteId)

    user.myNotes.splice(indexOfDeletedNote,1)

    await user.save()

    // send response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            deletedNote,
            "Note deleted successfully"
        ))
})


export {
    addNote,
    getNote,
    updateNote,
    deleteNote,
}
