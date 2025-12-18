import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
import { connectDB } from "./config/dbConnect.js";
import { adminRoute } from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";
import { contactRoute } from "./routes/contact.routes.js";
import careerRouter from "./routes/career.routes.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())
app.use('/admin',adminRoute)
app.use('/contact',contactRoute)
app.use('/career',careerRouter)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
connectDB()
app.listen(port, ()=>{
  console.log(`Server is running on http://localhost:${port}`);
})