import mongoose from "mongoose";
import { Game } from "../models/Game.js";
import  { Company } from "../models/Company.js";
import cloudinary from '../utils/cloudinary.js';

// Create a game
export const createGame = async (req, res) => {
    const game = req.body;

    
    const newGame = new Game(game);


    try {
        await newGame.save();

        const company = await Company.findById(game.companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        company.games.push(newGame._id);
        await company.save();


        res.status(201).json({ success: true, data: newGame });
    } catch (error) {
        console.log("Error in create game",error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const deleteGame = async (req, res) => {
    const { id } = req.params;
    const { companyId } = req.body; // Assuming you send companyId in the request body
    



    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "No game with that id" });
    }

    
    

    try {
        const game = await Game.findById(id)
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }



        const logoImgID = game.logo.public_id
        if (logoImgID) {
            await cloudinary.uploader.destroy(logoImgID);
        }
        
        const bgImgID = game.backgroundImage.public_id
        if (bgImgID) {
            await cloudinary.uploader.destroy(bgImgID);
        }

        const screenshots = game.screenshots
        if (screenshots) {
            for (let i = 0; i < screenshots.length; i++) {
                await cloudinary.uploader.destroy(screenshots[i].public_id);
            }
        }


        

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        company.games = company.games.filter(gameId => gameId.toString() !== id);
        await company.save();

        await Game.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Game deleted successfully" });
    } catch (error) {
        console.log("Error in delete game",error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }

}

export const updateGame = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "No game with that id" });
    }

    try {
        const game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }

        // Actualizar juego en la base de datos
        const updatedGame = await Game.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({ success: true, data: updatedGame });
    } catch (error) {
        console.error("Error updating game:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteImage = async (req, res) => {
    const { id } = req.params;
   
    try {
        await cloudinary.uploader.destroy(id);
        res.status(200).json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ success: false, message: "Error deleting image" });
    }
}
