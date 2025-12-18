import JobApplication from "../models/career.models.js";
import cloudinary from "../config/cloudinary.js";

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

    if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.startsWith("@") ||
      email.endsWith("@") ||
      email.endsWith(".")
    ) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (
      mobile.length !== 10 ||
      isNaN(mobile) ||
      Number(mobile[0]) < 6
    ) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Only JPG, JPEG, PNG images and PDF files are allowed" });
    }

    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "job_resumes",
      resource_type: resourceType
    });

    const data = await JobApplication.create({
      name,
      email,
      mobile,
      positionAppliedFor,
      experience,
      currentLocation,
      resume: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });


    return res.status(201).json({
      message: "Application submitted successfully",
      data
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
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

    // 🔹 Update normal fields
    if (name) application.name = name;
    if (email) application.email = email;
    if (mobile) application.mobile = mobile;
    if (positionAppliedFor) application.positionAppliedFor = positionAppliedFor;
    if (experience) application.experience = experience;
    if (currentLocation) application.currentLocation = currentLocation;

    // 🔹 Resume update
    if (req.file) {
  // delete old resume
  if (application.resume?.public_id) {
    const oldResourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
    await cloudinary.uploader.destroy(
      application.resume.public_id,
      { resource_type: oldResourceType }
    );
  }

  // upload new resume
  const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
  
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "job_resumes",
    resource_type: resourceType
  });

  application.resume = {
    url: result.secure_url,
    public_id: result.public_id
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

    // 🔴 Delete resume from Cloudinary
    if (application.resume?.public_id) {
  await cloudinary.uploader.destroy(
    application.resume.public_id,
    { resource_type: "raw" }
  );
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
