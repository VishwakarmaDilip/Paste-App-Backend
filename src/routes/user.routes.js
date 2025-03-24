import { Router } from "express";
import {
    changeCurrentPassword,
    loginUser,
    logoutUser,
    registerUser,
    updateAcountDetail,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changePassword").post(verifyJWT, changeCurrentPassword)
router.route("/updateAccount").patch(verifyJWT,updateAcountDetail)

export default router;
