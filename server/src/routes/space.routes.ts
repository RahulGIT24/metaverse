import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middleware/auth";
import { createSpace, deleteSpace, getMySpaces, getSpace } from "../controllers/space.controller";

const router = Router();

router.route("/").post(verifyJWT,createSpace)
router.route("/:spaceId").delete(verifyJWT,deleteSpace).get(verifyJWT,getSpace)
router.get("/my-spaces",verifyJWT,getMySpaces)
router.get("/all-spaces",verifyJWT,verifyAdmin, getMySpaces)

export default router;