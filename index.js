import dbConnect from "./src/db/index.js";
import { app } from "./src/app.js";

dbConnect().then(() => {
    app.listen(3000, () => {
        console.log("App is listening to port: 3000");
    })
}).catch(err => console.error("MongoDB connection failed"));
