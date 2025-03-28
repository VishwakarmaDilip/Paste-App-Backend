import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findOne(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        )
    }
}


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
        throw new ApiError(401, "user with Email or Username already exists")
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

const loginUser = asyncHandler(async (req, res) => {
    // get data
    const { identifier, password } = req.body

    // check for username or email
    if (!identifier) {
        throw new ApiError(402, "username or email is required")
    }

    // find the User
    const user = await User.findOne({
        $or: [{ email:identifier }, { username:identifier }],

    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(402, "Invalid user credentials")
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // Send cookie response
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const option = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("accessToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User Logged out"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, {}, "Invalid Old password")
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Password changed successfully")
        )


})

const updateAcountDetail = asyncHandler(async (req,res) => {
    const {fullName, email} = req.body

    if(!fullName && !email) {
        throw new ApiError(400, "At least one feild is required..!!")
    }

    const user = await User.findOneAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {new: true}
    ).select("-password")

    return res  
        .status(200)
        .json(new ApiResponse(200,user,"Account detail updated successfully"))



})

const getUserNotes = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "notes",
                localField: "_id",
                foreignField: "creater",
                as: "myNotes",
            }
        },
    ])

    return res 
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].myNotes,
                "All notes fetched"
            )
        )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    updateAcountDetail,
    getUserNotes
}