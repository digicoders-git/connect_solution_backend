import Contact from "../models/contact.models.js";

export const create = async (req,res) => {
  try {
    const { name,mobile, email, message } = req.body;
    if(!name || !mobile || !email || !message){
      return res.status(400).json({ message: "All fields are required" });
    }
    const data = await Contact.create({
      name,
      mobile,
      email,
      message
    });
    return res.status(200).json({ message: "Form submitted", data: data });
  } catch (error) {
    return res.status(500).json({ message:"Internal server error",error: error.message });
  }
}

export const getContact = async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });
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
    const { name, mobile, email, message } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (name) contact.name = name;
    if (mobile) contact.mobile = mobile;
    if (email) contact.email = email;
    if (message) contact.message = message;

    await contact.save();

    return res.status(200).json({
      message: "Contact updated successfully",
      data: contact
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

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json({
      message: "Contact deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
