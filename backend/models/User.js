import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username : { type: String, required: true },
        email : { type: String, required: true, unique: true },
        password : { type: String, required: true },
        companies : [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
        role : { type: String, enum: ["admin", "user"], default: "admin" },
    }
    , {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);