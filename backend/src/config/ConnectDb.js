

const mongoose = require("mongoose") // import mongoose for better communication with the database

const connectDb =async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection Established: ", 
            connect.connection.host, // host name 
            connect.connection.name // database name 
        ) // the above line is to connext our database with the actual application
    } catch(err){
        console.log(err);
        process.exit(1);

    }
}

module.exports = connectDb;