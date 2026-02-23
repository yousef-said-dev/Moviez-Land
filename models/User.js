import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  profileImg: {
    type: String,
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
  favorites: {
    type: Array,
    required: false,
    default: [],
  },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);