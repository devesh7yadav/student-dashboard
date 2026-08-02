//Starts the app
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./database/connectDB.js";
import courseRoutes from "./routes/courseRoutes.js"
import assignRoutes from "./routes/assignmentRoutes.js"
import calculatorRoutes from "./routes/calculatorRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const corsOptions = {
    origin: "http://localhost:5175",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/courses", courseRoutes);
app.use("/assignments", assignRoutes);
app.use("/calculator", calculatorRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server has started on Port ${PORT}`);
});