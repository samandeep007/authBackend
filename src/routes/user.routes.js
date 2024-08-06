import { Router } from "express";
import { login, register, logout} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/login').post(login);
router.route('/register').post(upload.single('avatar'), register);
router.route('/logout').post(verifyJWT, logout);

export {router}