import express from "express";
import { create, getAdmin, login, updateAdmin } from "../controllers/admin.controller.js";
import upload from '../middleware/multer.js'
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

export const adminRoute = express.Router()

adminRoute.post('/create',upload.single('profilePhoto'), create)
adminRoute.post('/login',login)
adminRoute.get('/get',verifyAdminToken,getAdmin)
adminRoute.put('/update/:id',verifyAdminToken,upload.single("profilePhoto"),updateAdmin)