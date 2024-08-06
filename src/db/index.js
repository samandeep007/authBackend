import mongoose from 'mongoose';

export default async function dbConnect() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {});
        const connectionReference = mongoose.connection;
        connectionReference.once('connected', () => {
            console.log("MongoDB connected successfully");
        })
        connectionReference.on('error', (err) => {
            console.error("MongoDB connection failed", err);
            process.exit(1);
        })

    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
}