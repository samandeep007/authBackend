import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import UserModel from "../models/user.model.js";

const generateAccessAndRefreshToken = async (id) => {
    try {
        const user = await UserModel.findById(id);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Failed to generate tokens", error);
        throw new ApiError(500, "Failed to generate tokens");
    }
}

const register = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some(field => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(400, "User already exist");
    }

    const avatarLocalPath = req.file.path;
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;

    const user = await UserModel.create({
        fullName: fullName,
        username: username,
        email: email,
        password: password,
        avatar: avatar?.url || 'https://www.samandeep.com'
    })

    const registeredUser = await UserModel.findById(user._id)?.select('-password -refreshToken');

    if (!registeredUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(200).json(new ApiResponse(200, "User registered successfully", registeredUser));

});

const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });

    if (!user) {
        throw new ApiError(400, "No user exists");
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Incorrect credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = await UserModel.findById(user._id).select('-password -refreshToken');

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User login successful", { loggedInUser, refreshToken, accessToken }))


})

const logout = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    });

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200, 
                "User logout successful", 
                {}
            ));

})

export {register, login, logout};