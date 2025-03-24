import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async (req, res) => {
    // get user detail    
    const { fullName, email, username, password } = req.body
 
    // validate - not empty
    let isEmpty = [fullName, email, username, password]
    isEmpty = isEmpty.some((feild) => {
        return feild?.trim() === ""
    })

    if (isEmpty) {
        throw new ApiError(400, "All feilds Required")
    }


    // check if user already exist: username, email
    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (existedUser) {
        throw new ApiError(400, "user with Email or Username already exists")
    }

    
    // create user object - create entry in DB
    const user = await User.create(
        {
            fullName,
            email,
            password,
            username: username.toLowerCase()
        }
    )


    // remove password and refresh token feild from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Somthing went wrong while registering the User")
    }


    // return response
    return res
        .status(200)
        .json(
            new ApiResponse(200, createdUser, "User Registered Successfully.")
        )
})


export {
    registerUser
}