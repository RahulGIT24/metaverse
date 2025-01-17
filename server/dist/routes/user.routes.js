"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/get-current-user", auth_1.verifyJWT, user_controller_1.getUser);
exports.default = router;
