import { app } from "./src/app.js";
import dbConnect from "./src/db/index.js";
import 'dotenv/config'

dbConnect().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is listening to port:", process.env.PORT || 3000);
    })
}).catch(err => console.error("MongoDB connection error"));