//Starts the app
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {origin: "*"};

app.use(cors(corsOptions));
app.use(express.json);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server has started on Port ${PORT}`);
});