import express from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { router as UserRouter } from './routes/user.routes.js';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))

app.use(express.json({
    limit: "16kb",
    extended: true
}))

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP, try again later"
})

app.use(express.static("./public"));

app.use(limiter);

app.use('/api/auth', UserRouter);

export {app}