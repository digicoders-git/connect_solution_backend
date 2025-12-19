import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
import { connectDB } from "./config/dbConnect.js";
import { adminRoute } from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";
import { contactRoute } from "./routes/contact.routes.js";
import careerRouter from "./routes/career.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())
app.use('/admin',adminRoute)
app.use('/contact',contactRoute)
app.use('/career',careerRouter)


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/upload", express.static(path.join(__dirname, "uploads")));

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