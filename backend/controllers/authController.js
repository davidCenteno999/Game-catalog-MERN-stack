import { User } from "../models/User.js";
import { Company } from "../models/Company.js";
import { Game } from "../models/Game.js";
import bycrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import e from "cors";

export const register = async (req, res) => { 
    const { username , email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    
    const hashedPassword = await bycrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password : hashedPassword,
        role
    });
    try {
        await newUser.save();

        // Generate JWT token
        const token = await createAccessToken({ id: newUser._id, role: newUser.role });
        // Set the token in a cookie
        res.cookie("token", token )
        res.status(201).json({ success: true, data: { 
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            id: newUser._id,
        } });
    } catch (error) {
        console.log("Error in register user", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = await createAccessToken({ id: user._id, role: user.role });
        // Set the token in a cookie
        res.cookie("token", token);
       
        res.status(200).json({ success: true, data: { 
            username: user.username,
            email: user.email,
            id: user._id,
        } });
    } catch (error) {
        console.log("Error in login user", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout user", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: {
            username: user.username,
            email: user.email,
            role: user.role,
            id: user._id,
        } });
    } catch (error) {
        console.log("Error in get profile", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(token, "secretKey", async (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        try {
            // Usa await para esperar a que la consulta se complete
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Responde con los datos del usuario
            res.status(200).json({
                success: true,
                data: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    id: decoded.id,
                    companies: user.companies,
                },
            });
        } catch (error) {
            console.error("Error finding user:", error.message);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    });
};


export const updateProfile = async (req, res) => {
    const { username, email, role } = req.body;
    const { id } = req.params; 

    try {
       const user = await User.findOne( { _id: id });
        

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if(email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
        }

        if (username && username !== user.username) {
            user.username = username;
        }
        if (email && email !== user.email) {
            user.email = email;
        }
        if (role && role !== user.role) {
            user.role = role;
        }
        await user.save();
        res.status(200).json({ success: true, data: { 
            username: user.username,
            email: user.email,
            role: user.role,
            id: user._id,
        } });
    } catch (error) {
        console.log("Error in update profile", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
    
}

export const deleteProfile = async (req, res) => {
    const { id } = req.params; 

    try {

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await User.findByIdAndDelete(id);
        
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in delete profile", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}