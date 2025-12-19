import express from "express";
import { createConsultation, deleteConsultation, getAllConsultations, updateConsultation } from "../controllers/consultation.controller.js";


const consultations = express.Router();

consultations.post("/create", createConsultation);
consultations.get("/get", getAllConsultations);
consultations.put("/update/:id", updateConsultation);
consultations.delete("/delete/:id", deleteConsultation);

export default consultations;
