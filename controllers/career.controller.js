import JobApplication from "../models/career.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

export const create = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      positionAppliedFor,
      experience,
      currentLocation
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !mobile ||
      !positionAppliedFor ||
      !experience ||
      !currentLocation
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.startsWith("@") ||
      email.endsWith("@") ||
      email.endsWith(".")
    ) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Mobile validation
    if (mobile.length !== 10 || isNaN(mobile) || Number(mobile[0]) < 6) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // Resume required
    if (!req.file) {
      return res.status(400).json({ message: "Resume (PDF) is required" });
    }

    // Local file info
    const resumeUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;

    const data = await JobApplication.create({
      name,
      email,
      mobile,
      positionAppliedFor,
      experience,
      currentLocation,
      resume: {
        filename: req.file.filename,
        path: resumeUrl
      }
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      data
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
};



export const getAll = async (req, res) => {
  try {
    const data = await JobApplication.find().sort({ createdAt: -1 });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};



export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobile,
      positionAppliedFor,
      experience,
      currentLocation
    } = req.body;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔹 Update text fields
    if (name) application.name = name;
    if (email) application.email = email;
    if (mobile) application.mobile = mobile;
    if (positionAppliedFor) application.positionAppliedFor = positionAppliedFor;
    if (experience) application.experience = experience;
    if (currentLocation) application.currentLocation = currentLocation;

    // 🔹 Resume update (LOCAL)
    if (req.file) {
      // delete old file
      if (application.resume?.filename) {
        const oldPath = path.join("uploads", application.resume.filename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const resumeUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;

      application.resume = {
        filename: req.file.filename,
        path: resumeUrl
      };
    }

    await application.save();

    return res.status(200).json({
      message: "Application updated successfully",
      data: application
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};



export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔴 Delete local resume file
    if (application.resume?.filename) {
      const filePath = path.join("uploads", application.resume.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await JobApplication.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Application deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

