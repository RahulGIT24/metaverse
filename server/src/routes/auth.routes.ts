import { Router } from "express";
import { signin, signUp } from "../controllers/auth.controller";

const router = Router();

router.post('/signup',signUp)
router.post('/signin',signin)
// router.post('/verifyToken') // later on
// router.post('/forgotpassword')
// router.post('/resetpassword')

export default router;