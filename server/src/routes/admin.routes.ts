import { Router } from "express";
import { createAvatar, createElement, createMap, updateElement } from "../controllers/admin.controller";
import { verifyAdmin, verifyJWT } from "../middleware/auth";

const router = Router();

router.route("/element").post(verifyJWT,verifyAdmin,createElement).patch(verifyJWT,verifyAdmin,updateElement)
router.post("/map",verifyJWT,verifyAdmin,createMap)
router.route("/avatar").post(verifyJWT,verifyAdmin,createAvatar)

export default router;