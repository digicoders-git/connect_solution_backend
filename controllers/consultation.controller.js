import Consultation from "../models/consultation.models.js";


// CREATE CONSULTATION
export const createConsultation = async (req, res) => {
  try {
    const { name, email, phone, business, message } = req.body;

    if (!name || !email || !phone || !business) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const consultation = await Consultation.create({
      name,
      email,
      phone,
      business,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      data: consultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CONSULTATIONS
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE CONSULTATION
export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedConsultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation updated successfully",
      data: updatedConsultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CONSULTATION
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedConsultation = await Consultation.findByIdAndDelete(id);

    if (!deletedConsultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
