import { create } from "zustand";
import { validateGame, validatePartialGame } from "@/schemas/game_schema";


export const useGameStore = create((set) => ({
    games : [],
    setGames: (games) => set({ games }),
    createGame : async (newGame) => {
        const validationResult = validateGame(newGame);
        if (validationResult.error) {
            return { success: false, message: "All fields are required" };
        }
        const response = await fetch("http://localhost:5555/game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newGame),
        });
        const data = await response.json();
        set((state) => ({ games: [...state.games, data.data] }));
        return { success: true, message: "Game created successfully" };
    } ,

    deleteGame: async (id, companyId) => {
        const res = await fetch(`http://localhost:5555/game/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ companyId }),
        });
        const data = await res.json();
        if (!data.success)  return { success: false, message: "Error delete" };

        set((state) => ({
            games: state.games.filter((game) => game.id !== id),
        }));

        return { success: true, message: "Game deleted successfully "};
            
    },

    updateGame: async (id, updatedGame) => {
        const validationResult = validatePartialGame(updatedGame);
        
        if (validationResult.error) {
            
            return { success: false, message: "All fields are required" };
        }
        const res = await fetch(`http://localhost:5555/game/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGame),
        });
        const data = await res.json();
        set((state) => ({
            games: state.games.map((game) => (game.id === id ? data.data : game)),
        }));
        return { success: true, message: "Game updated successfully" };
    },

    deleteImage: async (imageId) => {
        try {
           const res = await fetch(`http://localhost:5555/game/delete-image/${imageId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!data.success) return { success: false, message: "Error deleting image" };
            
            
        
            return { success: true, message: "Image deleted successfully" };
        }
        catch (error) {
            console.error("Error deleting image:", error);
            return { success: false, message: "Error deleting image" };
        }
    }


}));

