import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    unique: true, 
  },
  email: {
    type: String,
    required: true, 
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  imagePath : {
    type : String,
    required : false,
  },
  favorites: {
    type: Array,
    required: false,
    default: [],
  },
});
export default mongoose.models.User || mongoose.model('User', UserSchema);