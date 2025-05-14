import mongoose from "mongoose";

/**
 * El juego debe incluir:
 * 
Nombre, logo e imagen de fondo.
Tráiler (YouTube) y capturas de pantalla.
Enlaces de descarga y tiendas donde está disponible.
Plataformas en las que se encuentra (PC, PS4, Xbox, etc.).
Reviews externos (sacados de revistas digitales o plataformas en línea).
Premios ganados.

 */

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { 
      url: { type: String, required: true },
      public_id: { type: String, required: true }
     },
    backgroundImage: { 
      url: { type: String, required: true },
      public_id: { type: String, required: true }
     },
    trailer: { type: String, required: true },
    
    screenshots: [{ 
      url: { type: String, required: true },
      public_id: { type: String, required: true }
     }],

    downloadLinks: [
      {
        platform: { type: String, required: true },
        link: { type: String, required: true }
      }
    ],


    reviews: [
      {
        link: { type: String, required: true },
        score: { type: Number, required: true },
        reviewText: { type: String, required: true }
      }
    ], 
    
    awards: [
      { 
        event: { type: String, required: true },
        year: { type: Number, required: true },
        award: { type: String, required: true },

      },
    ],
    
    platforms: [{ type: String, required: true }],

    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true 
  }
);

export const Game = mongoose.model('Game', gameSchema);