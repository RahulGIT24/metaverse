import { Router } from "express";
import { verifyJWT } from "../middleware/auth";
import { getUser } from "../controllers/user.controller";

const router = Router();

router.get("/get-current-user",verifyJWT,getUser)

export default router;