//Starts the app
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./database/connectDB.js";
import courseRoutes from "./routes/courseRoutes.js"
import assignRoutes from "./routes/assignmentRoutes.js"

dotenv.config();

const app = express();

const corsOptions = {origin: "*"};

app.use(cors(corsOptions));
app.use(express.json());

//Routes
app.use("/courses", courseRoutes);
app.use("/assignments", assignRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server has started on Port ${PORT}`);
});