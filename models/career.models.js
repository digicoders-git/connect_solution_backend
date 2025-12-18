import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    positionAppliedFor: { type: String, required: true },
    experience: { type: String, required: true },
    currentLocation: { type: String, required: true },
    resume: {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }

  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", careerSchema);
export default JobApplication;
