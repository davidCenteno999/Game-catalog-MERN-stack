import express from 'express';
import { Game } from '../models/Game.js';
import { createGame , deleteGame , updateGame, deleteImage } from '../controllers/gameController.js';
import e from 'express';


const router = express.Router();

//Create a game
router.post('/', createGame);

//Get all database games
router.get('/', async (request, response) => {
    try {
        const games = await Game.find({});

        return response.status(200).json(games);


    }catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Obtener un solo juego por ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        console.log(id);
        const game = await Game.findById(id);

        if (!game) {
            return response.status(404).send({ message: 'Game not found' });
        }

        return response.status(200).json(game);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Actualizar un juego por ID
router.put('/:id', updateGame);

// Eliminar un juego por ID
router.delete('/:id', deleteGame);

// Eliminar una imagen por ID
router.delete('/delete-image/:id', deleteImage);


export default router;
