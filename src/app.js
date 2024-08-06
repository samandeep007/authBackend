import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.static('./public/'));

app.use(express.json({
    limit: "16kb",
    extended: true
}));

app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP. Try again later",
    header: true
});

app.use(limiter);

export {app};