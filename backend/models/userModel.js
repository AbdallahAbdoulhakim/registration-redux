import mongoose from "mongoose";
import bcrypt from "bcrypt";
const roles = [
  { code: 5150, description: "super admin" },
  { code: 5060, description: "admin" },
  { code: 4360, description: "publisher" },
  { code: 4220, description: "editor" },
  { code: 3020, description: "user" },
];

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
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
  roles: {
    type: [Number],
    default: [roles.find((role) => role.description === "user").code],
  },
  active: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);
