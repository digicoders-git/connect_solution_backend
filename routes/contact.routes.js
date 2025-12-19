import express from "express";
import { create, getContact, remove, update } from "../controllers/contact.controller.js";

export const contactRoute = express.Router()
contactRoute.post("/create", create)
contactRoute.get("/get", getContact)
contactRoute.put("/update/:id", update)
contactRoute.delete("/delete/:id", remove)
