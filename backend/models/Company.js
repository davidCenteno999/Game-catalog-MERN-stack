import mongoose from "mongoose";
//nombre, información de contacto, enlaces a pagina web, redes, descripcion(3 parrafos), logo

const companySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        contactInfo: {
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        websiteLinks: {
            website: { type: String, required: true },
            socialMedia: [ 
                {
                    platform: { type: String, required: true },
                    link: { type: String, required: true },
                },
            ],

        },
        description: { type: String, required: true },
        logo: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        games: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
        ],
    },
    {
        timestamps: true,
    }
);

export const Company = mongoose.model("Company", companySchema);