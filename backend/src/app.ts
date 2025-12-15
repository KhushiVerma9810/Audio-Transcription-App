import express from "express";
import cors from "cors";
import router from "./routes/router";
import { errorMiddleware } from "./middlewares/error.middleware";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

app.use("/api", router);


app.use(errorMiddleware);

export default app;