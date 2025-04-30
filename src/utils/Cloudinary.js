import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from './ApiError.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload image to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        fs.unlinkSync(localFilePath); // delete local file after upload
        return response.secure_url; // return the URL of the uploaded image
    } catch (error) {
        fs.unlinkSync(localFilePath); // delete local file in case of error
        return null
    }
}

// extract public id
const getPublicIdFromURL = (url) => {
    const parts = url.split("/")
    const fileName = parts.pop()
    const publicId = fileName.split(".")[0]

    return publicId
}

//delete
const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return null

        const publicId = getPublicIdFromURL(url)

        const result = await cloudinary.uploader.destroy(publicId)

        console.log("Deleted:", result);

    } catch (error) {
        throw new ApiError(401, error.message)
    }
}


export { uploadOnCloudinary, deleteFromCloudinary }