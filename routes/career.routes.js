import express from "express";
import {upload} from '../middleware/multerPdf.js'
// import multer from "multer";
import { create, getAll, remove, update } from "../controllers/career.controller.js";

const careerRouter = express.Router();

careerRouter.post("/create",upload.single("resume"),create);
careerRouter.get("/get", getAll);
careerRouter.put("/update/:id", upload.single("resume"), update);
careerRouter.delete("/delete/:id", remove);
// careerRouter.get("/download/:id", downloadResume);

 
export default careerRouter;
