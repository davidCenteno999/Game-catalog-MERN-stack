import express from "express";
import mongoose from 'mongoose';
import {PORT, mongoDBUrl} from "./config.js";
import gameRoute from './routes/gameRoute.js'
import userRoute from './routes/authRoute.js'
import companyRoute from './routes/companyRoute.js'
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to MERN Stack');
});

app.use('/game', gameRoute);

app.use('/auth', userRoute);

app.use('/company', companyRoute);

mongoose.connect(mongoDBUrl)
.then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
        console.log(`App is listening to port: ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
});