
import { Router } from "express";
import { googleAuth } from "../controllers/googleLogin.controller.js";

const googleRouter=Router();

googleRouter.route("/google").post(googleAuth)

export default googleRouter;





