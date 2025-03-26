import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addNote,
    deleteNote,
    getNote,
    updateNote
} from "../controllers/note.controllers.js";


const router = Router()

router.use(verifyJWT)

router.route("/addNote").post(addNote)
router.route("/getNote/:noteId").get(getNote)
router.route("/updateNote/:noteId").patch(updateNote)
router.route("/deleteNote/:noteId").delete(deleteNote)


export default router