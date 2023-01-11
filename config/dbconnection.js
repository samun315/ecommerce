const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        mongoose.set('strictQuery', true);
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        throw error;
    }
    
}

module.exports = dbConnect;