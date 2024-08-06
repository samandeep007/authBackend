import mongoose from 'mongoose';

export default async function dbConnect(){
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {});
        const connectionReference = mongoose.connection;
        connectionReference.once('connection', () => {
            console.log("MongoDB connection successful");
        })
        connectionReference.on('error', (error)=> {
            console.error("MongoDB connection failed", error);
            process.exit(1);
        })
        
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
}