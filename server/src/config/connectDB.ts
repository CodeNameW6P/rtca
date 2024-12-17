import { connect } from "mongoose";

const connectDB = async () => {
    const connectionString = process.env.DB_CONNECTION_STRING;
    
    try {
        const connection = await connect(connectionString as string);
        console.log(`Database connection established: ${connection.connection.host}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
    }
};

export default connectDB;
