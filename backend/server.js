import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
dotenv.config({});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "Server is running smoothly" });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server: ", error.message);
    process.exit(1);
  }
};

startServer();
