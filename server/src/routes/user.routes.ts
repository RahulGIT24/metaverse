import { Router } from "express";
import { verifyJWT } from "../middleware/auth";
import { setMetaData, getUser, getAvatars, getBulkMetaData } from "../controllers/user.controller";

const router = Router();

router.get("/get-current-user",verifyJWT,getUser)
router.post("/set-user-metadata",verifyJWT,setMetaData)
router.get("/get-avatars",verifyJWT,getAvatars)
router.get("/get-user-metaData",verifyJWT,getBulkMetaData)
export default router;