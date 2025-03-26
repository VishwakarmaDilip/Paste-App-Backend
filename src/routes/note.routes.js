import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addNote } from "../controllers/note.controllers.js";


const router = Router()

router.use(verifyJWT)

router.route("/addNote").post(addNote)


export default router