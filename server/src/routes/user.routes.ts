import { Router } from "express";
import { verifyJWT } from "../middleware/auth";
import { setMetaData, getUser, getAvatars, getBulkMetaData } from "../controllers/user.controller";

const router = Router();

router.get("/get-current-user",verifyJWT,getUser)
router.post("/metadata",verifyJWT,setMetaData)
router.get("/avatars",verifyJWT,getAvatars)
router.get("/metadata/bulk",verifyJWT,getBulkMetaData)
export default router;