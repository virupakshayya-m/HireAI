import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "Server is running smoothly" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  (console.log(`server llistening on port ${PORT}`));
});