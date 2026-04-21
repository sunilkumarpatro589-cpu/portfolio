import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    minlength: 3 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /.+@.+\..+/ 
  },
  age: { 
    type: Number, 
    min: 1, 
    max: 100 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

export default model("User", userSchema);