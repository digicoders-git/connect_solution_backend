import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  profilePhoto:{
    type:String,
    // default:"",
  }
}, {timestamps:true})

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;